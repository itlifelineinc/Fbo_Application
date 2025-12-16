
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber: string;
  message?: string;
  isVisible: boolean;
  className?: string;
}

const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ 
  phoneNumber, 
  message, 
  isVisible,
  className 
}) => {
  if (!isVisible || !phoneNumber) return null;

  // Clean phone number for URL
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message || "Hi, I'm interested in learning more!");
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer hover:shadow-emerald-500/30 ${className || 'fixed bottom-6 right-6'}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} color="white" fill="white" />
    </a>
  );
};

export default WhatsAppFloatingButton;
