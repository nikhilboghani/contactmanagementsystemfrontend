import { useState } from 'react';
import { useContacts } from '../contexts/ContactContext';
import { toast } from 'react-toastify';

export default function ContactForm({ contact, onClose }) {
  const { addContact, updateContact, categories = ['Family', 'Friend', 'Work', 'Other'] } = useContacts(); // Default categories
  const [formData, setFormData] = useState(
    contact || {
      name: '',
      email: '',
      phone: '',
      address: '',
      category: 'Other', // Default category
      notes: '',
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state

    try {
      if (contact) {
        await updateContact(contact._id, formData); // Update contact by ID
        toast.success('Contact updated successfully!');
      } else {
        await addContact(formData); // Add new contact
        toast.success('Contact added successfully!');
      }
      onClose?.(); // Close the form
    } catch (error) {
      console.error('Error during contact save:', error.message);
      toast.error('Failed to save contact. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          required
          pattern="[0-9]{10}" // Basic 10-digit validation
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="1234567890"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows="3"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes about this contact..."
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          disabled={isSubmitting} // Disable during submission
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={isSubmitting} // Disable during submission
        >
          {isSubmitting ? 'Saving...' : contact ? 'Update' : 'Add'} Contact
        </button>
      </div>
    </form>
  );
}
