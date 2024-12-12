import { useState } from 'react';
import { FaPhone, FaEdit, FaTrash, FaStar, FaRegStar, FaComment } from 'react-icons/fa';
import { format } from 'date-fns';
import { useContacts } from '../contexts/ContactContext';

export default function ContactCard({ contact, onEdit, onDelete, onCall }) {
  const { toggleFavorite, updateNotes } = useContacts();
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(contact?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(contact._id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error.message);
      alert('Failed to update favorite status. Please try again.');
    }
  };

  const handleNotesSubmit = async () => {
    setIsSaving(true);
    try {
      await updateNotes(contact._id, notes);
      setShowNotes(false);
      alert('Notes updated successfully!');
    } catch (error) {
      console.error('Failed to update notes:', error.message);
      alert('Failed to save notes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{contact.name}</h3>
            <button
              onClick={handleToggleFavorite}
              className="text-yellow-500 hover:text-yellow-600"
              title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {contact.isFavorite ? <FaStar /> : <FaRegStar />}
            </button>
          </div>
          <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full mt-2">
            {contact.category || 'Uncategorized'}
          </span>
          <div className="mt-2 space-y-1 text-sm sm:text-base">
            <p className="text-gray-600 flex items-center">
              <span className="font-medium w-20 sm:w-24">Email:</span>
              {contact.email || 'N/A'}
            </p>
            <p className="text-gray-600 flex items-center">
              <span className="font-medium w-20 sm:w-24">Phone:</span>
              {contact.phone || 'N/A'}
            </p>
            <p className="text-gray-600 flex items-center">
              <span className="font-medium w-20 sm:w-24">Address:</span>
              {contact.address || 'N/A'}
            </p>
            <p className="text-gray-600 text-sm">
              Last contacted:{' '}
              {contact.lastContacted
                ? format(new Date(contact.lastContacted), 'MMM dd, yyyy')
                : 'No record'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-between items-center border-t pt-4">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="text-gray-600 hover:text-gray-800 flex items-center mb-2 sm:mb-0"
          title="Toggle notes"
        >
          <FaComment className="mr-1" />
          Notes
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => onCall(contact.phone)}
            className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors duration-200"
            title="Call contact"
            aria-label="Call contact"
          >
            <FaPhone />
          </button>
          <button
            onClick={() => onEdit(contact)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
            title="Edit contact"
            aria-label="Edit contact"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(contact._id)}
            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
            title="Delete contact"
            aria-label="Delete contact"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {showNotes && (
        <div className="mt-4 border-t pt-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded-md text-sm sm:text-base"
            rows="3"
            placeholder="Add notes about this contact..."
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={() => setShowNotes(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleNotesSubmit}
              className="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
