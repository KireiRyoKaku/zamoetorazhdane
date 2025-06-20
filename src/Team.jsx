import React, { useState, useRef, useEffect } from "react";
import aneliaImage from "/public/assets/pictures/good/anelia-good-ench.png";
import galitaImage from "/public/assets/pictures/good/galita-good-ench.png";
import katyaImage from "/public/assets/pictures/good/katya-good-ench.png";
import stelaImage from "/public/assets/pictures/good/stela-good.png";
import { FaInstagram, FaFacebook, FaGlobe, FaViber } from "react-icons/fa";

// ================ TEAM MEMBER COMPONENT ================
const TeamMember = React.forwardRef(
  (
    {
      firstName,
      lastName,
      title,
      role,
      image,
      isExpanded,
      onClick,
      linkInsta,
      linkFacebook,
      linkWebsite,
      linkVibergroup,
    },
    ref,
  ) => {
    const [showRole, setShowRole] = useState(false);
    const [showName, setShowName] = useState(false);
    const [showCollapsedName, setShowCollapsedName] = useState(false);
    const [showLinks, setShowLinks] = useState(false);

    // Control visibility with slight delays after expansion or collapse
    useEffect(() => {
      if (isExpanded) {
        // Reset collapsed name immediately
        setShowCollapsedName(false);

        // Show expanded content with delays
        const nameTimer = setTimeout(() => {
          setShowName(true);
        }, 200);

        const roleTimer = setTimeout(() => {
          setShowRole(true);
        }, 400);

        // Show links with a longer delay to ensure card is centered
        const linksTimer = setTimeout(() => {
          setShowLinks(true);
        }, 600);

        return () => {
          clearTimeout(nameTimer);
          clearTimeout(roleTimer);
          clearTimeout(linksTimer);
        };
      } else {
        // Reset expanded content
        setShowName(false);
        setShowRole(false);
        setShowLinks(false);

        // Show collapsed name with slight delay
        const collapsedNameTimer = setTimeout(() => {
          setShowCollapsedName(true);
        }, 200);

        return () => {
          clearTimeout(collapsedNameTimer);
        };
      }
    }, [isExpanded]);

    return (
      <div
        ref={ref}
        className={`relative flex-shrink-0 items-center justify-center overflow-hidden rounded-md shadow-lg transition-all duration-700 ${
          isExpanded
            ? "h-[calc(100dvh-128px)] w-full max-w-[75%] bg-moetoRazhdaneYellow md:h-[600px] md:max-w-[50%]"
            : "h-[calc(100dvh-128px)] w-36 max-w-[23%] bg-white md:h-[600px]"
        }`}
        onClick={onClick}
      >
        <img
          src={image}
          alt={`${firstName} ${lastName}'s photo`}
          className={`absolute bottom-0 left-0 object-cover transition-all duration-700 ${
            isExpanded
              ? "-bottom-10 h-[calc(70dvh-128px)] max-h-[400px]"
              : "h-[250px] w-[250px]"
          }`}
        />

        {/* Color overlay with transition */}
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isExpanded ? "bg-slate-300 opacity-0" : "bg-slate-300 opacity-15"
          }`}
        />

        {!isExpanded && (
          <div className="absolute left-0 top-4 z-10 w-full p-5 text-center">
            <div
              className={`rotate-90 transform font-playfairDisplaySc text-3xl font-bold text-black transition-all duration-700 ease-in-out ${
                showCollapsedName
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              {firstName}
            </div>
          </div>
        )}

        {isExpanded && (
          <>
            <div className="absolute left-0 top-0 m-5 w-full">
              <h3
                className={`transform font-playfairDisplaySc text-3xl font-bold text-black drop-shadow-lg transition-all duration-700 ease-in-out ${
                  showName
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                {title} {firstName} {lastName}
              </h3>
              <p
                className={`max-w-[90%] transform whitespace-normal break-words pt-4 text-xl font-light text-black drop-shadow-lg transition-all duration-700 ease-in-out ${
                  showRole
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                {role}
              </p>
            </div>

            {/* Social Links Pill with center-outward animation */}
            {(linkInsta || linkFacebook || linkWebsite || linkVibergroup) && (
              <div
                className={`absolute bottom-10 left-1/2 z-20 origin-center -translate-x-1/2 transform-gpu transition-all duration-500 ease-in-out ${
                  showLinks ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4 whitespace-nowrap rounded-3xl bg-moetoRazhdaneLightGreen px-5 py-3 shadow-lg ring-4 ring-white">
                  {linkInsta && (
                    <a
                      href={linkInsta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transform-gpu transition-all duration-500 ease-in-out hover:text-moetoRazhdanePurple"
                    >
                      <FaInstagram className="h-6 w-6" />
                    </a>
                  )}
                  {linkFacebook && (
                    <a
                      href={linkFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transform-gpu transition-all duration-500 ease-in-out hover:text-blue-600"
                    >
                      <FaFacebook className="h-6 w-6" />
                    </a>
                  )}
                  {linkWebsite && (
                    <a
                      href={linkWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all duration-500 ease-in-out hover:text-white"
                    >
                      <FaGlobe className="h-6 w-6" />
                    </a>
                  )}
                  {linkVibergroup && (
                    <a
                      href={linkVibergroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-600"
                    >
                      <FaViber className="h-6 w-6" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);

// ================ TEAM DATA ================
const teamMembers = [
  {
    title: "",
    firstName: "Анелия",
    lastName: "Такова",
    role: "консултант по детски сън, обучаващ се в подкрепа преди и след раждането",
    linkInsta: "https://www.instagram.com/sunzatebe/",
    linkFacebook: "https://www.facebook.com/sunzatebesunzamene",
    linkWebsite: "https://www.sunzatebe.com/",
    image: aneliaImage,
  },
  {
    title: "д-р",
    firstName: "Галита",
    lastName: "Дечева",
    role: "лекар, консултант по кърмене и хранене и ранно детско развитие",
    linkInsta: "https://www.instagram.com/le.montessori/",
    linkFacebook: "https://www.facebook.com/le.montessori",
    linkWebsite: "https://www.facebook.com/groups/sledvaydeteto",
    image: galitaImage,
  },
  {
    title: "",
    firstName: "Катя",
    lastName: "Ушева",
    role: "психолог",
    linkInsta: "https://www.instagram.com/travel.inside.your.soul/",
    linkVibergroup:
      "https://invite.viber.com/?g2=AQAwLm9O0zVKLFNpw2hf4gob5pxBweALNK6JMgXwFo6hy0AwRgTnsBt2fJ1oVDGK&lang=en",
    linkWebsite:
      "http://calendly.com/katya-usheva-psychologist/15min?month=2025-01",
    image: katyaImage,
  },
  {
    title: "",
    firstName: "Стела",
    lastName: "Дончева",
    role: "психолог, психотерапевт, следродилна дула и треньор",
    linkInsta: "https://www.facebook.com/perimamabg",
    linkFacebook: "https://www.facebook.com/perimamabg",
    linkWebsite: "https://zemnastela.com/",
    image: stelaImage,
  },
];

// ================ MAIN TEAM COMPONENT ================
const Team = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const memberRefs = useRef([]);

  // Set up refs for team members
  useEffect(() => {
    memberRefs.current = memberRefs.current.slice(0, teamMembers.length);
  }, [teamMembers.length]);

  // Add fade-in animation effect on mount
  useEffect(() => {
    // Trigger fade in animation after component mounts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  // Enhanced scroll function for perfect centering
  const scrollToCenter = (element, container) => {
    if (!element || !container) return;

    // Get element dimensions
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate the center position
    const targetLeft =
      element.offsetLeft - containerRect.width / 2 + elementRect.width / 2;

    // Smooth scroll to center the element
    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);

    // Scroll handling with improved centering
    if (expandedIndex !== index) {
      // Allow a moment for the state to update
      setTimeout(() => {
        const container = containerRef.current;
        const element = memberRefs.current[index];

        if (container && element) {
          // First center using our custom function
          scrollToCenter(element, container);

          // Additional check after animation has started
          setTimeout(() => {
            scrollToCenter(element, container);
          }, 350); // Check again after expansion has started
        }
      }, 50);
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div
        ref={containerRef}
        className="flex items-start gap-x-2 overflow-x-auto scroll-smooth p-5 md:justify-center"
      >
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            ref={(el) => (memberRefs.current[index] = el)}
            firstName={member.firstName}
            lastName={member.lastName}
            title={member.title}
            role={member.role}
            image={member.image}
            linkInsta={member.linkInsta}
            linkFacebook={member.linkFacebook}
            linkWebsite={member.linkWebsite}
            linkVibergroup={member.linkVibergroup}
            isExpanded={expandedIndex === index}
            onClick={() => handleToggleExpand(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;
