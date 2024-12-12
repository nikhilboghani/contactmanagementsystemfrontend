import { useState, useEffect } from 'react';
import { useContacts } from '../contexts/ContactContext';
import { FaSearch } from 'react-icons/fa';
import ContactCard from './ContactCard';
import ContactFilters from './ContactFilters';
import EditContactModal from './EditContactModal';
import { toast } from 'react-toastify';

export default function ContactList() {
  const { contacts, deleteContact, searchContacts } = useContacts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ category: null, favoritesOnly: false });
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    const results = searchContacts(searchQuery, filters);
    setFilteredContacts(results);
  }, [searchQuery, filters, contacts, searchContacts]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id);
        toast.success('Contact deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete contact.');
      }
    }
  };

  const handleCall = (phoneNumber) => {
  // Use the 'tel:' protocol to open the dialer with the phone number
  const phoneLink = `tel:${phoneNumber}`;

  // If you're on a mobile device, it will open the dialer automatically
  window.location.href = phoneLink;

  // Optionally, you can also copy the phone number to the clipboard (works on desktop too)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(phoneNumber).then(() => {
      console.log('Phone number copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy phone number:', err);
    });
  }
};
  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-gray-100 p-4 shadow-sm z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <ContactFilters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No contacts found.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              onEdit={setEditingContact}
              onDelete={handleDelete}
              onCall={handleCall}
            />
          ))}
        </div>
      )}

      {editingContact && (
        <EditContactModal
          contact={editingContact}
          onClose={() => setEditingContact(null)}
        />
      )}
    </div>
  );
}
