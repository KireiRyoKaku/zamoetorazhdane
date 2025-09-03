import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import icon1 from "/assets/pictures/icons/icon1.png";
import icon2 from "/assets/pictures/icons/icon2.png";
import icon3 from "/assets/pictures/icons/icon3.png";

const EventsNew = ({ onClose }) => {
  const navigate = useNavigate();
  const params = useParams(); // Get URL parameters
  const [isClosing, setIsClosing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Create refs for each card
  const cardRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    cardRefs.current = Array(eventCards.length)
      .fill()
      .map((_, i) => cardRefs.current[i] || React.createRef());
  }, []);

  // Animation states for each element type
  const [headerVisible, setHeaderVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);
  const [iconImageVisible, setIconImageVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  // Add these new state variables
  const [currentIcon, setCurrentIcon] = useState(null);
  const [isIconTransitioning, setIsIconTransitioning] = useState(false);

  // Event cards definition
  const eventCards = [
    {
      id: 1,
      title: "Време за мама (онлайн и на живо)",
      // Wrap image in a div to control size consistently
      icon: (
        <div className="flex h-32 w-32 items-center justify-center md:h-52 md:w-52">
          <img
            src={icon1 || "/assets/pictures/icons/icon1.png"}
            alt="Време за мама"
            className="h-full w-auto object-contain"
            onError={(e) => {
              // Fallback to icon component if image fails to load
              e.target.style.display = "none";
              e.target.parentNode.innerHTML =
                '<svg class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-moetoRazhdanePurple"><MdOutlineSelfImprovement /></svg>';
            }}
          />
        </div>
      ),
      iconColor: "text-moetoRazhdanePurple",
      description:
        "Групови практики (само за майки, без деца), в които пълним своите чашки с любов и грижа към себе си. Нека това бъдат твоите 90 минути в месеца, в които да се обърнеш навътре към себе си, да си подариш грижата, от която имаш нужда и да си благодариш за всичко, което си",
    },
    {
      id: 2,
      title: "Майчински кръг (онлайн и на живо)",
      icon: (
        <div className="flex h-32 w-32 items-center justify-center md:h-52 md:w-52">
          <img
            src={icon2 || "/assets/pictures/icons/icon2.png"}
            alt="Майчински кръг"
            className="h-full w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentNode.innerHTML =
                '<svg class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-moetoRazhdaneGreen"><FaPeopleGroup /></svg>';
            }}
          />
        </div>
      ),
      iconColor: "text-moetoRazhdaneGreen",
      description:
        'Събираме се (със своите бебета/малки деца) и си говорим открито и задълбочено по дадена тема от майчинството. Но не в лекционен формат - тук силно застъпена е дискусионната част и споделянето. На фокус е подкрепата и приемането, че всички сме различни и че няма "правилен" и "грешен" път.',
    },
    {
      id: 3,
      title: "Специални събития (само на живо)",
      // Already using React Icon - just ensure consistent sizing
      icon: (
        <div className="flex h-32 w-32 items-center justify-center md:h-52 md:w-52">
          <img
            src={icon3 || "/assets/pictures/icons/icon3.png"}
            alt="Специални събития"
            className="h-full w-auto object-contain"
            onError={(e) => {
              // Fallback to icon component if image fails to load
              e.target.style.display = "none";
              e.target.parentNode.innerHTML =
                '<svg class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-moetoRazhdanePurple"><MdOutlineSelfImprovement /></svg>';
            }}
          />
        </div>
      ),
      iconColor: "text-moetoRazhdaneYellow",
      description:
        "Периодично в програмата ни присъства поне едно специално събитие или творилница. Събираме се и творим с ръцете си нещо красиво и/или практично, което да отнесем със себе си към вкъщи след това. Вдъхновяваме се взаимно, черпим от женската енергия и се зареждаме чрез изкуство. И най-вече: говорим си, разпускаме и се забавляваме.",
    },
    {
      id: 4,
      title: "Срещи с гост-лектори (само онлайн)",
      // Already using React Icon - just ensure consistent sizing
      icon: (
        <div className="flex h-32 w-32 items-center justify-center md:h-52 md:w-52">
          <img
            src={icon3 || "/assets/pictures/icons/icon3.png"}
            alt="Специални събития"
            className="h-full w-auto object-contain"
            onError={(e) => {
              // Fallback to icon component if image fails to load
              e.target.style.display = "none";
              e.target.parentNode.innerHTML =
                '<svg class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-moetoRazhdanePurple"><MdOutlineSelfImprovement /></svg>';
            }}
          />
        </div>
      ),
      iconColor: "text-moetoRazhdaneYellow",
      description:
        "В клуба те очакват вдъхновяващи срещи с различни специалисти, които ще споделят своето знание, опит и гледни точки, за да обогатят ежедневието ти с нови идеи, практики и подкрепа.",
    },
    {
      id: 5,
      title: "Q&A с екипа (само онлайн)",
      // Already using React Icon - just ensure consistent sizing
      icon: (
        <div className="flex h-32 w-32 items-center justify-center md:h-52 md:w-52">
          <img
            src={icon3 || "/assets/pictures/icons/icon3.png"}
            alt="Специални събития"
            className="h-full w-auto object-contain"
            onError={(e) => {
              // Fallback to icon component if image fails to load
              e.target.style.display = "none";
              e.target.parentNode.innerHTML =
                '<svg class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-moetoRazhdanePurple"><MdOutlineSelfImprovement /></svg>';
            }}
          />
        </div>
      ),
      iconColor: "text-moetoRazhdaneYellow",
      description:
        "Периодични срещи, където можеш да попиташ всичко, което те вълнува. Ние, като екип от специалисти, ще сме там да ти отговорим с внимание, разбиране и практични насоки. Твоите въпроси са важни, защото отварят пространство за истински разговор и подкрепа.",
    },
  ];

  // Set initial active index based on route parameter
  useEffect(() => {
    // Check for eventId parameter
    if (params.eventId) {
      const eventId = parseInt(params.eventId);
      const eventIndex = eventCards.findIndex((card) => card.id === eventId);
      if (eventIndex !== -1) {
        setActiveIndex(eventIndex);
      }
    }

    // Start animation sequence - add separate timing for icon image
    const timeout = setTimeout(() => {
      setHeaderVisible(true);
      setTimeout(() => setIconVisible(true), 200);
      setTimeout(() => setIconImageVisible(true), 300); // Stagger the icon animation
      setTimeout(() => setTitleVisible(true), 400);
      setTimeout(() => setTextVisible(true), 500);
      setTimeout(() => setButtonVisible(true), 600);
    }, 100);

    return () => clearTimeout(timeout);
  }, [params.eventId]);

  // Initialize current icon on first render
  useEffect(() => {
    setCurrentIcon(eventCards[activeIndex].icon);
  }, []);

  // Handle icon transition specifically
  useEffect(() => {
    if (currentIcon !== null) {
      // Skip first render
      // Start transition - fade out current icon
      setIsIconTransitioning(true);
      setIconImageVisible(false);

      // After fade-out completes, update the icon
      const iconChangeTimeout = setTimeout(() => {
        setCurrentIcon(eventCards[activeIndex].icon);

        // Then after content swap, fade in the new icon
        setTimeout(() => {
          setIconImageVisible(true);
          setIsIconTransitioning(false);
        }, 50);
      }, 350); // Half of the duration-700 transition time

      return () => clearTimeout(iconChangeTimeout);
    }
  }, [activeIndex]);

  // Animation sequence when active index changes
  useEffect(() => {
    // Reset animations when changing events
    setIconVisible(false);
    setIconImageVisible(false); // Reset icon image specifically
    setTitleVisible(false);
    setTextVisible(false);
    setButtonVisible(false);

    // Trigger new animations
    const timeout = setTimeout(() => {
      setIconVisible(true);
      setTimeout(() => setTitleVisible(true), 200);
      setTimeout(() => setTextVisible(true), 300);
      setTimeout(() => setButtonVisible(true), 400);
      setTimeout(() => setIconImageVisible(true), 500); // Stagger the icon animation
    }, 50);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

  // Navigate to a specific event
  const navigateToEvent = (index) => {
    const eventId = eventCards[index].id;
    navigate(`/events/${eventId}`);
  };

  // Navigate to previous card
  const goToPrevious = () => {
    const newIndex =
      activeIndex === 0 ? eventCards.length - 1 : activeIndex - 1;
    navigateToEvent(newIndex);
  };

  // Navigate to next card
  const goToNext = () => {
    const newIndex =
      activeIndex === eventCards.length - 1 ? 0 : activeIndex + 1;
    navigateToEvent(newIndex);
  };

  const card = eventCards[activeIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-white md:flex md:items-center md:justify-center">
      <div className="mx-auto max-w-6xl px-8 pb-4 pt-8 sm:px-6 lg:px-8">
        {/* Navigation header with arrow buttons */}
        <div
          className={`transform transition-all duration-500 ${
            headerVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            {/* Large circular navigation buttons */}
            <div className="flex w-full justify-between px-1 sm:px-1"></div>
          </div>
        </div>

        {/* Main content with staggered animation */}
        <div
          id={`event-${eventCards[activeIndex].id}`}
          ref={cardRefs.current[activeIndex]}
          className="mx-auto max-w-3xl scroll-mt-16"
        >
          {/* Icon with side arrows */}
          <div
            className={`mb-6 flex transform items-center justify-center transition-all duration-500 ease-out ${
              iconVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {/* Left arrow */}
            <button
              onClick={goToPrevious}
              className="mr-8 flex h-12 w-12 items-center justify-center rounded-full bg-moetoRazhdaneDarkGreen/10 text-moetoRazhdaneDarkGreen transition-all hover:bg-moetoRazhdaneDarkGreen/20 sm:h-14 sm:w-14 md:mr-16"
              aria-label="Previous"
            >
              <IoChevronBack className="text-xl sm:text-2xl" />
            </button>

            {/* Icon with its own separate animation */}
            <div
              className={`flex items-center justify-center transition-all duration-700 ease-linear ${
                iconImageVisible
                  ? "scale-100 opacity-100"
                  : "scale-50 opacity-0"
              }`}
            >
              {currentIcon}
            </div>

            {/* Right arrow */}
            <button
              onClick={goToNext}
              className="ml-8 flex h-12 w-12 items-center justify-center rounded-full bg-moetoRazhdaneDarkGreen/10 text-moetoRazhdaneDarkGreen transition-all hover:bg-moetoRazhdaneDarkGreen/20 sm:h-14 sm:w-14 md:ml-16"
              aria-label="Next"
            >
              <IoChevronForward className="text-xl sm:text-2xl" />
            </button>
          </div>
          {/* Navigation indicators */}
          <div className="mt-8 flex justify-center space-x-2">
            {eventCards.map((card, index) => (
              <Link
                key={card.id}
                to={`/events/${card.id}`}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "scale-110 bg-moetoRazhdaneDarkGreen"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Navigate to ${card.title}`}
              />
            ))}
          </div>
          {/* Title */}
          <h2
            className={`mb-4 transform text-center font-magnoliaScript text-4xl text-moetoRazhdaneDarkGreen transition-all duration-500 ease-out ${
              titleVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            {card.title}
          </h2>

          {/* Description */}
          <div
            className={`mb-4 transform transition-all duration-500 ease-out ${
              textVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <p className="text-left font-rocaTwoThin text-lg font-light text-gray-700">
              {card.description}
            </p>
          </div>

          {/* Action button */}
          <div
            className={`flex transform justify-center transition-all duration-500 ease-out ${
              buttonVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <button
              className="rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-rocaTwoRegular text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30"
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  navigate("/program");
                  onClose();
                }, 300);
              }}
            >
              ВКЛЮЧИ СЕ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsNew;
