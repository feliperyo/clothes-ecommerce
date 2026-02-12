import { FaWhatsapp } from 'react-icons/fa';

const pulseStyle = {
  animation: 'whatsapp-aura 2s ease-in-out infinite',
};

const WhatsAppButton = () => {
  return (
    <>
      <style>{`
        @keyframes whatsapp-aura {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5), 0 10px 15px -3px rgba(0,0,0,0.1); }
          50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0), 0 10px 15px -3px rgba(0,0,0,0.1); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.5), 0 10px 15px -3px rgba(0,0,0,0.1); }
        }
      `}</style>
      <a
        href="https://wa.me/5511913762420?text=Ol%C3%A1!%20Vim%20pelo%20site%20Ana%20Curve%20Shop%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es!"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-2.5 hover:scale-110 transition-transform duration-300"
        style={pulseStyle}
        aria-label="Fale conosco pelo WhatsApp"
        title="Fale conosco pelo WhatsApp"
      >
        <FaWhatsapp size={20} />
      </a>
    </>
  );
};

export default WhatsAppButton;
