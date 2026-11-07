import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  // DISABLED: Cookie consent popup is currently disabled
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // setShowBanner(true); // Commented out to disable popup
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    // Here you would enable any optional cookies/tracking
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
    // Here you would ensure optional cookies are disabled
  };

  if (!showBanner) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[10000] mx-auto w-full bg-white/95 p-4 font-rocaTwoRegular shadow-lg backdrop-blur-sm">
      <div className="mx-auto flex max-w-xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="max-w-md text-left text-sm text-fourth/80">
          Този сайт използва бисквитки, за да подобри вашето преживяване.
        </p>
        <div className="sx:flex-row flex w-full flex-col gap-2 self-stretch sm:w-auto sm:self-auto">
          <button
            onClick={handleAccept}
            className="w-full whitespace-nowrap rounded-lg bg-third px-4 py-2 text-fourth transition-colors duration-300 hover:bg-primary sm:w-auto"
          >
            Приемам
          </button>
          <button
            onClick={handleDecline}
            className="w-full whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-fourth transition-colors duration-300 hover:bg-secondary sm:w-auto"
          >
            Отказвам
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
