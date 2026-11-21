import { useState, useEffect, useRef } from "react";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { partnersAll } from "./partnerData";

// Single Partner Card Component
const PartnerCard = ({
  partnerName,
  description,
  image,
  linkWeb,
  linkInsta,
  linkFace,
  linkYoutube,
}) => {
  // Find the first available link
  const firstAvailableLink = linkWeb || linkInsta || linkFace || linkYoutube;

  // Handle card click
  const handleCardClick = () => {
    if (firstAvailableLink) {
      window.open(firstAvailableLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`grid h-80 w-full grid-rows-[8rem_4rem_minmax(0,1fr)_2rem] text-center transition-all duration-300 ${firstAvailableLink ? "cursor-pointer" : ""}`}
      onClick={firstAvailableLink ? handleCardClick : undefined}
    >
      <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={`${partnerName} logo`}
          className="h-auto items-center w-full object-contain p-1"
        />
      </div>
      <h3 className="flex items-center justify-center font-magnoliaScript text-3xl font-bold text-fourth">
        {partnerName}
      </h3>
      {description && (
        <p className="flex min-h-0 items-start justify-center pt-2 font-rocaTwoThin text-lg font-light text-fourth">
          {description}
        </p>
      )}
      {(linkInsta || linkFace || linkYoutube) && (
        <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          {linkInsta && (
            <a
              href={linkInsta}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fourth hover:text-fourth"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
          )}
          {linkFace && (
            <a
              href={linkFace}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fourth hover:text-fourth"
            >
              <FaFacebook className="h-6 w-6" />
            </a>
          )}
          {linkYoutube && (
            <a
              href={linkYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fourth hover:text-fourth"
            >
              <FaYoutube className="h-6 w-6" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const Partners = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState([]);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const containerRef = useRef(null);

  // Handle scroll position to check if at bottom
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Consider "at bottom" when within 20px of the bottom
    const bottomThreshold = 20;
    const isBottom = scrollHeight - scrollTop - clientHeight < bottomThreshold;

    setIsAtBottom(isBottom);
  };

  useEffect(() => {
    // Trigger fade in animation after component mounts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });

    // Add scroll event listener
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
    }

    // Staggered animation for partner cards
    const timer = setTimeout(() => {
      const itemCount = partnersAll.length;

      // Stagger the animations
      for (let i = 0; i < itemCount; i++) {
        setTimeout(() => {
          setAnimatedItems((prev) => [...prev, i]);
        }, i * 100); // 100ms stagger between each card
      }
    }, 300);

    // Clean up event listeners
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("scroll", handleScroll);
      }
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative z-10 flex w-full justify-center px-5 pb-16 pt-7">
        <div className="relative min-h-[calc(100dvh-125px)] w-full max-w-3xl">
          {/* Faded bottom overlay with dynamic opacity */}
          <div
            className={`pointer-events-none absolute bottom-0 left-0 z-10 h-40 w-full rounded-b-xl bg-gradient-to-t from-slate-50 to-transparent transition-opacity duration-300 ${
              isAtBottom ? "opacity-0" : "opacity-100"
            }`}
          ></div>

          {/* Original container with unchanged styling */}
          <div
            ref={containerRef}
            className={`min-h-[calc(100dvh-125px)] w-full transform rounded-xl bg-slate-50 p-8 text-left font-playfairDisplay transition-all duration-300 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            onScroll={handleScroll}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-3">
              {partnersAll.map((partner, index) => (
                <div
                  key={index}
                  className={`transform transition-all duration-500 ${
                    animatedItems.includes(index)
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <PartnerCard
                    partnerName={partner.partnerName}
                    description={partner.description}
                    image={partner.image}
                    linkWeb={partner.link}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
