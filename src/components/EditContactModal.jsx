import ContactForm from './ContactForm';

export default function EditContactModal({ contact, onClose }) {
  if (!contact) {
    return null; // Safeguard in case `contact` is null or undefined
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.(); // Close the modal when clicking on the backdrop
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick} // Handle backdrop clicks
      role="dialog"
      aria-labelledby="edit-contact-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full sm:max-w-lg">
        <h2 id="edit-contact-title" className="text-lg font-semibold mb-4 text-center">
          Edit Contact
        </h2>
        <ContactForm contact={contact} onClose={onClose} />
      </div>
    </div>
  );
}
