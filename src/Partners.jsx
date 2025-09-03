import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import sgusheniImage from "./assets/pictures/partners/sgusheni-logo-H.png";
import bendidaImage from "./assets/pictures/partners/bendida.png";
import svetlanaImage from "./assets/pictures/partners/svetlana nencheva.png";
import nutrimamaImage from "./assets/pictures/partners/nutrimama.png";
import pekarnatanadaniImage from "./assets/pictures/partners/pekarnata na Dani.png";
import lekanoshtmilozaicheImage from "./assets/pictures/partners/lekanosht.png";
import greenrevoluciaImage from "./assets/pictures/partners/green revolucia.png";
import carrydanceImage from "./assets/pictures/partners/carrydanceImage.jpg";
import { FaGlobe, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";

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
      className={`flex h-80 w-full flex-col items-center justify-between transition-all duration-300 ${firstAvailableLink ? "cursor-pointer" : ""}`}
      onClick={firstAvailableLink ? handleCardClick : undefined}
    >
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={`${partnerName} logo`}
          className="h-auto w-full object-contain p-1"
        />
      </div>
      <h3 className="mt-4 text-center font-playfairDisplaySc text-3xl font-bold text-black">
        {partnerName}
      </h3>
      {description && (
        <p className="mt-2 text-center font-yanoneKaffeesatz text-xl font-light text-gray-600">
          {description}
        </p>
      )}
      {(linkWeb || linkInsta || linkFace || linkYoutube) && (
        <div className="mt-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
          {linkWeb && (
            <a
              href={linkWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500"
            >
              <FaGlobe className="h-6 w-6" />
            </a>
          )}
          {linkInsta && (
            <a
              href={linkInsta}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500"
            >
              <FaInstagram className="h-6 w-6" />
            </a>
          )}
          {linkFace && (
            <a
              href={linkFace}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500"
            >
              <FaFacebook className="h-6 w-6" />
            </a>
          )}
          {linkYoutube && (
            <a
              href={linkYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500"
            >
              <FaYoutube className="h-6 w-6" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

const Partners = ({ onClose }) => {
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

  // ================ PARTNERS DATA ================
  const partnersAll = [
    {
      partnerName: "Сгушени",
      description:
        "Всичко необходимо за гардероба на бременната, кърмеща и бебеносеща майка.",
      image: sgusheniImage,
      link: "https://sgusheni.com/",
    },
    {
      partnerName: "Бендида",
      description: "Храни за женски хормонален баланс.",
      image: bendidaImage,
      link: "https://bendidawellness.com/",
    },
    {
      partnerName: "Нутри Мама",
      description: "Здравословно хапване за цялото семейство.",
      image: nutrimamaImage,
      link: "https://www.instagram.com/nutrimamabg/",
    },
    {
      partnerName: "Светлана Ненчева",
      description: "Консултант женско здраве, Нутриционист, Треньор",
      image: svetlanaImage,
      link: "https://www.instagram.com/svetlana_nencheva/",
    },
    {
      partnerName: "Лека нощ, мило зайче",
      description:
        "Консултантска практика в подкрепа на ранното детско развитие, храненето и съня.",
      image: lekanoshtmilozaicheImage,
      link: "https://www.lekanoshtmilozaiche.com/",
    },
    {
      partnerName: "Пекарната на Дани",
      description: "В синхрон с природата, сезоните и хората, творяща с любов.",
      image: pekarnatanadaniImage,
      link: "https://www.facebook.com/TheDanisBakery/?locale=bg_BG",
    },
    {
      partnerName: "Green Revolucia",
      description: "Първият онлайн магазин с Нулев Отпадък в България",
      image: greenrevoluciaImage,
      link: "https://www.greenrevolucia.com/",
    },a
    {
      partnerName: "Carry Dance",
      description: "Активности за мама и бебе",
      image: carrydanceImage,
      link: "https://www.facebook.com/people/Carry-Dance-Sofia-%D0%90%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D1%81%D1%82%D0%B8-%D0%B7%D0%B0-%D0%BC%D0%B0%D0%BC%D0%B0-%D0%B8-%D0%B1%D0%B5%D0%B1%D0%B5/61552205436719/",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className={`fixed z-50 flex px-5 pt-7`}>
        <div className="relative h-[calc(100dvh-125px)] w-full">
          {/* Faded bottom overlay with dynamic opacity */}
          <div
            className={`pointer-events-none absolute bottom-0 left-0 z-10 h-40 w-full rounded-b-xl bg-gradient-to-t from-slate-50 to-transparent transition-opacity duration-300 ${
              isAtBottom ? "opacity-0" : "opacity-100"
            }`}
          ></div>

          {/* Original container with unchanged styling */}
          <div
            ref={containerRef}
            className={`h-full w-full max-w-3xl transform overflow-y-auto rounded-xl bg-slate-50 p-8 text-left font-playfairDisplay transition-all duration-300 ease-in-out ${
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

Partners.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Partners;
