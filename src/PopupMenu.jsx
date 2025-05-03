import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoSmall from "./assets/pictures/logoSmall.png"; // Add this import at the top

const PopupMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close menu after navigation
  };

  // Update the route detection logic to handle event pages with hash fragments
  // Map of routes to their display names
  const routeNames = {
    "/": { text: "Включи се", link: "/program" },
    "/program": { text: "Програма", link: null },
    "/events": { text: "Събития", link: null },
    "/about": { text: "За нас", link: null },
    "/partners": { text: "Партньори", link: null },
    "/team": { text: "Екип", link: null },
  };

  // Determine current route text and link
  let currentRoute;

  // Check if we're on a subscribe/payment page
  if (
    location.pathname.includes("subscribe") ||
    location.pathname.includes("pay")
  ) {
    currentRoute = { text: "Формуляр", link: null };
  }
  // Check if we're on events page or any event-specific page
  else if (location.pathname.includes("/events")) {
    currentRoute = routeNames["/events"];
  } else {
    currentRoute = routeNames[location.pathname] || routeNames["/"];
  }

  return (
    <div
      ref={menuRef}
      className="fixed bottom-0 left-0 z-[9999] w-full pb-4 font-playfairDisplaySc text-2xl font-black drop-shadow-xl"
    >
      <div className="mx-auto w-11/12">
        <div
          className={`rounded-3xl bg-white transition-all ${
            isMenuOpen ? "duration-1000" : "duration-300"
          } ease-in-out`}
        >
          <div className="overflow-hidden">
            <div
              className={`transform transition-all ${
                isMenuOpen ? "duration-1000" : "duration-300"
              } ease-in-out ${
                isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col space-y-5 px-9 py-5 pb-0">
                {/* Only show Program in menu if not on homepage AND not on program page */}
                {location.pathname !== "/program" &&
                  location.pathname !== "/" && (
                    <button
                      onClick={() => handleNavigation("/program")}
                      className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                    >
                      Програма
                    </button>
                  )}
                {/* Rest of the menu buttons remain unchanged */}
                {location.pathname !== "/events" && (
                  <button
                    onClick={() => handleNavigation("/events")}
                    className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                  >
                    Събития
                  </button>
                )}
                {location.pathname !== "/about" && (
                  <button
                    onClick={() => handleNavigation("/about")}
                    className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                  >
                    За нас
                  </button>
                )}
                {location.pathname !== "/partners" && (
                  <button
                    onClick={() => handleNavigation("/partners")}
                    className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                  >
                    Партньори
                  </button>
                )}
                {location.pathname !== "/team" && (
                  <button
                    onClick={() => handleNavigation("/team")}
                    className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                  >
                    Екип
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Menu Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() =>
                currentRoute.link && handleNavigation(currentRoute.link)
              }
              className={`rounded-2xl px-4 text-black transition-colors duration-200 ${
                currentRoute.link
                  ? "bg-moetoRazhdaneYellow hover:bg-transparent hover:text-black/30"
                  : "cursor-default bg-transparent"
              } px-2 py-2`} // Increased padding and added min-width
            >
              {currentRoute.text}
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNavigation("/")}
                className={`flex h-12 w-12 transform-gpu items-center justify-center rounded-full bg-white/20 transition-all duration-1000 ease-in-out will-change-transform ${
                  location.pathname === "/"
                    ? "invisible opacity-0"
                    : "visible opacity-100"
                } hover:opacity-70`}
              >
                <img
                  src={logoSmall}
                  alt="Home"
                  className="h-10 w-10 rounded-full bg-moetoRazhdaneDarkGreen object-contain"
                />
              </button>
              <button
                onClick={toggleMenu}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-all duration-300 hover:text-black/30"
              >
                <svg
                  className={`h-6 w-6 text-black transition-transform duration-1000 ${
                    isMenuOpen ? "rotate-90" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupMenu;
