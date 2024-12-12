import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ContactContext = createContext();

export const useContacts = () => useContext(ContactContext);

export const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userId = user._id;
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (token) fetchContacts();
    else alert('Please log in to access contacts.');
  }, [token]);

  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/api/contacts');
      setContacts(response.data.contacts);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const addContact = async (contact) => {
    try {
      const response = await api.post('/api/contacts', { ...contact, userId });
      setContacts((prev) => [...prev, response.data]);
      alert('Contact added successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to add contact.');
    }
  };

  const updateContact = async (id, updatedContact) => {
    try {
      const response = await api.put(`/api/contacts/${id}`, updatedContact);
      setContacts((prev) =>
        prev.map((contact) => (contact._id === id ? response.data : contact))
      );
      alert('Contact updated successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to update contact.');
    }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/api/contacts/${id}`);
      setContacts((prev) => prev.filter((contact) => contact._id !== id));
      alert('Contact deleted successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to delete contact.');
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const contact = contacts.find((contact) => contact._id === id);
      if (!contact) {
        alert('Contact not found!');
        return;
      }
      const response = await api.put(`/api/contacts/${id}`, {
        ...contact,
        isFavorite: !contact.isFavorite,
      });
      setContacts((prev) =>
        prev.map((contact) => (contact._id === id ? response.data : contact))
      );
      alert('Favorite status updated successfully!');
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Failed to toggle favorite.');
    }
  };

  const searchContacts = (query, filters) => {
    return contacts.filter((contact) => {
      const matchesQuery =
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase()) ||
        contact.phone.includes(query);

      const matchesCategory = filters.category
        ? contact.category === filters.category
        : true;

      const matchesFavorite = filters.favoritesOnly
        ? contact.isFavorite
        : true;

      return matchesQuery && matchesCategory && matchesFavorite;
    });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts,
        addContact,
        updateContact,
        deleteContact,
        toggleFavorite,
        fetchContacts,
        searchContacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};
