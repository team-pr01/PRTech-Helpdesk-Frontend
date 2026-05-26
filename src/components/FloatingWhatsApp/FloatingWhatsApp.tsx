import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const phoneNumber = "+8801572915890";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\+/g, "")}`;

  // Hide on scroll down, show on scroll up
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // Show tooltip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Auto hide tooltip after 5 seconds
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-16 right-0 mb-2 animate-bounce">
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative">
            Need help? Chat with us!
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative flex items-center justify-center
          w-14 h-14 rounded-full shadow-lg
          transition-all duration-300 transform
          bg-green-500 hover:bg-green-600
          ${isHovered ? "scale-110" : "scale-100"}
        `}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp 
          size={32} 
          className="text-white transition-transform duration-300"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)"
          }}
        />
        
        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-75"></div>
        
        {/* Notification badge (optional) */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
          1
        </span>
      </button>

      {/* Status indicator */}
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 mt-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 whitespace-nowrap">Online</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingWhatsApp;