import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    // Here you would enable any optional cookies/tracking
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
    // Here you would ensure optional cookies are disabled
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 mx-auto w-full bg-white/95 backdrop-blur-sm p-4 shadow-lg z-[10000]">
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-left text-black/80 max-w-md">
          Този сайт използва бисквитки, за да подобри вашето преживяване. 
        </p>
        <div className="flex flex-col sx:flex-row gap-2 w-full sm:w-auto self-stretch sm:self-auto">
          <button
            onClick={handleAccept}
            className="whitespace-nowrap px-4 py-2 bg-moetoRazhdaneYellow rounded-lg text-black hover:bg-moetoRazhdaneLightGreen transition-colors duration-300 w-full sm:w-auto"
          >
            Приемам
          </button>
          <button
            onClick={handleDecline}
            className="whitespace-nowrap px-4 py-2 bg-gray-200 rounded-lg text-black hover:bg-gray-300 transition-colors duration-300 w-full sm:w-auto"
          >
            Отказвам
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;