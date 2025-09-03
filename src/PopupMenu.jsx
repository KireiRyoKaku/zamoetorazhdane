import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoSmall from "./assets/pictures/logo-green-outline.png"; // Updated to use pink logo without text

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
    "/": { text: "ВКЛЮЧИ СЕ", link: "/program" },
    "/program": { text: "ПРОГРАМА", link: null },
    "/events": { text: "СЪБИТИЯ", link: null },
    "/about": { text: "ЗА НАС", link: null },
    "/partners": { text: "ПАРТНЬОРИ", link: null },
    "/team": { text: "ЕКИП", link: null },
  };

  // Determine current route text and link
  let currentRoute;

  // Get the full URL including hash for proper route detection
  const fullPath = location.pathname + location.hash;

  // Check if we're on a subscribe/payment page
  if (fullPath.includes("subscribe") || fullPath.includes("pay")) {
    currentRoute = { text: "Формуляр", link: null };
  }
  // Check if we're on events page or any event-specific page (including hash routes)
  else if (fullPath.includes("/events") || fullPath.includes("#/events")) {
    currentRoute = routeNames["/events"];
  } else {
    currentRoute = routeNames[location.pathname] || routeNames["/"];
  }

  return (
    <div
      ref={menuRef}
      className="fixed bottom-0 left-0 z-[9999] w-full pb-4 font-rocaTwoRegular text-2xl font-black drop-shadow-xl"
    >
      <div className="mx-auto w-11/12 max-w-sm sm:max-w-md md:max-w-lg">
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
                      ПРОГРАМА
                    </button>
                  )}
                {/* Rest of the menu buttons remain unchanged */}
                {!fullPath.includes("/events") &&
                  !fullPath.includes("#/events") && (
                    <button
                      onClick={() => handleNavigation("/events")}
                      className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                    >
                      СЪБИТИЯ
                    </button>
                  )}
                {location.pathname !== "/about" && (
                  <button
                    onClick={() => handleNavigation("/about")}
                    className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                  >
                    ЗА НАС
                  </button>
                )}
                {location.pathname !== "/partners" && (
                  <button
                    onClick={() => handleNavigation("/partners")}
                    className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                  >
                    ПАРТНЬОРИ
                  </button>
                )}
                {location.pathname !== "/team" && (
                  <button
                    onClick={() => handleNavigation("/team")}
                    className="text-left text-black transition-colors duration-1000 hover:text-black/30"
                  >
                    ЕКИП
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Menu Bar - clickable when closed, closable when open (except on frontpage with program button) */}
          <div 
            className={`flex items-center justify-between px-4 py-3 ${
              !isMenuOpen ? "cursor-pointer" : (location.pathname === "/" && currentRoute.link ? "" : "cursor-pointer")
            }`}
            onClick={(e) => {
              if (!isMenuOpen) {
                // When closed, always open the menu
                toggleMenu();
              } else {
                // When open, close the menu UNLESS we're on frontpage with program button
                if (location.pathname === "/" && currentRoute.link) {
                  // On frontpage with program button - don't close, let button handle it
                  return;
                } else {
                  // On other pages or frontpage without program button - close menu
                  toggleMenu();
                }
              }
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentRoute.link) {
                  handleNavigation(currentRoute.link);
                } else if (isMenuOpen) {
                  // If no link and menu is open, do nothing (just prevent propagation)
                } else {
                  // If no link and menu is closed, open the menu
                  toggleMenu();
                }
              }}
              className={`rounded-2xl px-4 text-black transition-colors duration-200 ${
                currentRoute.link
                  ? "bg-moetoRazhdaneYellow hover:bg-transparent hover:text-black/30 cursor-pointer"
                  : "cursor-default bg-transparent"
              } px-2 py-2`}
            >
              {currentRoute.text}
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation("/");
                }}
                className={`flex h-12 w-11 transform-gpu items-center justify-center rounded-2xl bg-moetoRazhdaneYellow transition-all duration-1000 ease-in-out will-change-transform ${
                  location.pathname === "/"
                    ? "invisible opacity-0"
                    : "visible opacity-100"
                } hover:bg-transparent hover:text-black/30`}
              >
                <img
                  src={logoSmall}
                  alt="Home"
                  className="h-10 w-10 object-contain"
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMenu();
                }}
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
