
import React from 'react';

interface WhatsAppFloatingButtonProps {
  phoneNumber: string;
  message?: string;
  isVisible: boolean;
}

const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ phoneNumber, message = "Hi, I'm interested in learning more!", isVisible }) => {
  if (!isVisible || !phoneNumber) return null;

  // Clean phone number for URL
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
        <path d="M12.0117 2.0026C6.5067 2.0026 2.0195 6.478 2.0195 11.983C2.0195 13.896 2.5699 15.686 3.5308 17.221L2.0026 22.0026L7.221 20.6126C8.673 21.4396 10.315 21.9026 12.0117 21.9026C17.516 21.9026 22.0026 17.428 22.0026 11.923C22.0026 6.417 17.516 2.0026 12.0117 2.0026ZM12.0117 20.2196C10.499 20.2196 9.079 19.8056 7.846 19.0766L7.553 18.9026L4.35 19.7566L5.207 16.6346L5.016 16.3316C4.195 15.0276 3.766 13.5296 3.766 11.983C3.766 7.4396 7.466 3.7436 12.0117 3.7436C16.557 3.7436 20.257 7.4396 20.257 11.983C20.257 16.5266 16.557 20.2196 12.0117 20.2196Z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloatingButton;
