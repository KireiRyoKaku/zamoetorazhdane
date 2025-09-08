import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import SubscribeAndPay from "./SubscribeAndPay";
import { useNavigate, useLocation } from "react-router-dom";
import calBgImage from "./assets/pictures/logo-and-text-green-outline.png";
import heartbeatLogo from "./assets/pictures/HeartbeatLogo.png";

import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaDesktop,
  FaInstagram,
} from "react-icons/fa";
import { API_URL } from "../utils/apiConfig.js";

const MyBirthCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [interactableDates, setInteractableDates] = useState([]);
  const [interactableDatesOnline, setInteractableDatesOnline] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [events, setEvents] = useState([]);
  const [ShowSubscribeAndPay, setShowSubscribeAndPay] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [errorState, setErrorState] = useState(null); // Add error state
  const [locationFilter, setLocationFilter] = useState(null); // null, 'sofia', 'plovdiv', or 'online'
  const [animatingCalendar, setAnimatingCalendar] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true); // Add loading state
  const [modalEventId, setModalEventId] = useState(null); // Track which event modal is open
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL; // http://localhost:5174

  // Add function to toggle description modal
  const toggleDescriptionModal = (eventId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setModalEventId(eventId);
  };

  // Function to close modal
  const closeModal = () => {
    setModalEventId(null);
  };

  // Function to extract the first sentence in quotes from description
  const getFirstQuotedSentence = (description) => {
    if (!description) return '';
    
    // Remove HTML tags first
    const textOnly = description.replace(/<[^>]*>/g, '');
    
    // Look for text between quotes (both " and ")
    const quotedMatch = textOnly.match(/[""]([^"""]+)[""]/) || textOnly.match(/"([^"]+)"/);
    
    if (quotedMatch) {
      return quotedMatch[1].trim();
    }
    
    return '';
  };

  // Add escape key handler for modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && modalEventId) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [modalEventId]);

  // Move this function INSIDE the component
  const toggleLocationFilter = (location) => {
    // Map Latin to Cyrillic location names
    const locationMap = {
      sofia: "sofia",
      plovdiv: "plovdiv",
      online: "online",
    };

    // Convert to Cyrillic for comparison (except online which stays the same)
    const cyrillicLocationMap = {
      sofia: "софия",
      plovdiv: "пловдив", 
      online: "online",
    };

    const filterValue = cyrillicLocationMap[location];

    // Toggle functionality: if same location is clicked, remove filter
    if (locationFilter === filterValue) {
      setLocationFilter(null);
    } else {
      // Otherwise set the new filter
      setLocationFilter(filterValue);
    }
  };

  // Update the toast notification effect with delay
  useEffect(() => {
    if (location.state?.showSuccessToast) {
      // Clear the navigation state immediately to prevent showing toast on refresh
      window.history.replaceState({}, document.title);

      // Add delay before showing toast
      const showTimer = setTimeout(() => {
        setShowToast(true);
      }, 300); // 500ms delay before showing toast

      // Auto-hide toast after 6 seconds (from when it appears)
      const hideTimer = setTimeout(() => {
        setShowToast(false);
      }, 7500); // 6000ms + 500ms delay

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [location.state]);

  useEffect(() => {
    // Trigger animation when filter or month changes
    setAnimatingCalendar(true);
    const timer = setTimeout(() => {
      setAnimatingCalendar(false);
    }, 700); // Animation duration

    return () => clearTimeout(timer);
  }, [locationFilter, currentDate]); // Dependencies that should trigger animation

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (prev.getMonth() === 0) {
        newDate.setMonth(11);
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setMonth(prev.getMonth() - 1);
      }
      return newDate;
    });
  };

  const currentMonthEvents = events.filter((event) => {
    const eventDate = event.dateOfEvent.split(".");
    const eventMonth = parseInt(eventDate[1]) - 1; // Convert to 0-based month
    const eventYear = parseInt(eventDate[2]); // Get the year
    return eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
  });

  // Modified function to conditionally enable next month navigation
  const hasFutureEventsOrIsCurrentCalendarMonth = () => {
    // Get the current real date
    const today = new Date();
    const currentRealYear = today.getFullYear();
    const currentRealMonth = today.getMonth();

    // Check if the next month we would navigate to is the current real month
    // This allows for always being able to navigate back to the current month
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);

    const wouldNavigateToCurrentMonth =
      nextMonth.getFullYear() === currentRealYear &&
      nextMonth.getMonth() === currentRealMonth;

    // If navigation would take us to the real current month, allow it
    if (wouldNavigateToCurrentMonth) {
      return true;
    }

    // Otherwise, check if there are events in future months
    nextMonth.setDate(1);
    nextMonth.setHours(0, 0, 0, 0);

    return events.some((event) => {
      const datePart = event.dateOfEvent.split(",")[0];
      const [day, month, year] = datePart.split(".").map(Number);
      const eventDate = new Date(year, month - 1, day);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate >= nextMonth;
    });
  };

  const handleNextMonth = () => {
    // Only allow navigation if there are future events or we can navigate to current month
    if (hasFutureEventsOrIsCurrentCalendarMonth()) {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        if (prev.getMonth() === 11) {
          newDate.setMonth(0);
          newDate.setFullYear(prev.getFullYear() + 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
    }
  };

  // Helper function to check if the current calendar month is in the past
  const isCurrentMonthInPast = () => {
    const today = new Date();
    const currentRealYear = today.getFullYear();
    const currentRealMonth = today.getMonth();
    
    return (
      currentDate.getFullYear() < currentRealYear ||
      (currentDate.getFullYear() === currentRealYear && currentDate.getMonth() < currentRealMonth)
    );
  };

  const handleClickSubscribeAndPay = (event) => {
    // For online events (URLs), open the link directly
    if (/^https?:\/\/.+/i.test(event.location)) {
      window.open(event.location, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // For regular events, navigate to subscription page
    navigate(`/subscribe-and-pay/${event.cID}`, {
      state: {
        eventSummary: event.summary,
        eventDate: event.dateOfEvent,
        eventDay: event.dayOfEvent,
        eventID: event.ID,
        eventTime: event.timeStart, // Add this line
        eventEnd: event.end,
        eventLocation: event.location,
        eventDescription: event.description,
        eventDateLocaleString: event.dateOfEventLocaleString,
        eventType: event.type,
      },
    });

    setShowSubscribeAndPay(true);
    setTimeout(() => setIsBlurred(false), 10); // Short delay to ensure the modal is rendered
  };

  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        setIsLoadingEvents(true); // Start loading
        console.log("🔄 Fetching events from:", `${API_URL}/events`);

        const response = await fetch(`${API_URL}/events`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const events = await response.json();
        console.log("✅ Events fetched successfully:", events.length, "events");

        const dates = events.map((event) => event.dayOfEvent);
        setInteractableDates(dates);

        const onlineDatesArray = events.filter(
          (event) => /^https?:\/\/.+/i.test(event.location),
        );
        const onlineDates = onlineDatesArray.map((event) => event.dayOfEvent);
        setInteractableDatesOnline(onlineDates);

        setEvents(events);
      } catch (error) {
        console.error("❌ Error fetching event dates:", error);
        setErrorState({ message: `Failed to load events: ${error.message}` });

        // Fallback to empty state
        setInteractableDates([]);
        setInteractableDatesOnline([]);
        setEvents([]);
      } finally {
        setIsLoadingEvents(false); // End loading
      }
    };

    fetchEventDates();
  }, [apiUrl]); // Only depend on apiUrl, which shouldn't change often

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 200); // 500ms delay before starting the animation

    return () => clearTimeout(timer);
  }, []);

  const handleEventInteraction = (eventId) => {
    // First, close any open event descriptions
    const openDescription = document.querySelector(
      ".EventDescription:not(.hidden)",
    );

    if (
      openDescription &&
      openDescription.getAttribute("data-id") !== eventId
    ) {
      // Animate out the currently open description
      openDescription.classList.remove("opacity-100", "max-h-[700px]");
      openDescription.classList.add("opacity-0", "max-h-0");
      setTimeout(() => {
        openDescription.classList.add("hidden");
        openDescription.classList.remove("opacity-0", "max-h-0");
      }, 300);
    }

    // Then handle the clicked event
    const eventDescription = document.querySelector(
      `.EventDescription[data-id="${eventId}"]`,
    );

    if (eventDescription) {
      eventDescription.classList.add(
        "transition-all",
        "duration-300",
        "ease-in-out",
      );

      if (eventDescription.classList.contains("hidden")) {
        // Show the description
        eventDescription.classList.remove("hidden");
        eventDescription.classList.add("opacity-0", "max-h-0");
        void eventDescription.offsetHeight; // Force reflow
        eventDescription.classList.remove("opacity-0", "max-h-0");
        eventDescription.classList.add("opacity-100", "max-h-[700px]");

        // Use scrollIntoView with proper timing and options
        setTimeout(() => {
          // Find the parent event box
          const eventBox = eventDescription.closest(".event-box");
          if (eventBox) {
            // Use the more reliable scrollIntoView method
            eventBox.scrollIntoView({
              behavior: "smooth",
              block: "start", // Align the top of the element with the top of the viewport
              inline: "nearest",
            });

            // Add additional offset from top of viewport using scrollBy
            setTimeout(() => {
              window.scrollBy({
                top: -80, // Negative value to move up (offset from top)
                behavior: "smooth",
              });
            }, 200);
          }
        }, 100); // Increased delay to ensure animation has started
      } else {
        // Animate out
        eventDescription.classList.remove("opacity-100", "max-h-[700px]");
        eventDescription.classList.add("opacity-0", "max-h-0");
        setTimeout(() => {
          eventDescription.classList.add("hidden");
          eventDescription.classList.remove("opacity-0", "max-h-0");
        }, 300);
      }
    }
  };

  const handleDayClick = (day) => {
    if (interactableDates.includes(day)) {
      const event = currentMonthEvents.find(
        (event) => event.dayOfEvent === day,
      );
      if (event) {
        handleEventInteraction(event.ID);
      }
    }
  };

  // Add this function to check if a date is in the past using Bulgaria timezone
  const isDateInPast = (year, month, day) => {
    // Get current date in Bulgaria timezone (Europe/Sofia)
    const nowInBulgaria = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Sofia"
    });
    const todayInBulgaria = new Date(nowInBulgaria);
    todayInBulgaria.setHours(0, 0, 0, 0); // Reset time to start of day

    const checkDate = new Date(year, month, day);
    return checkDate < todayInBulgaria;
  };

  const isEventInPast = (event) => {
    if (!event.dateOfEvent) return false;

    try {
      // Extract just the date part before any comma
      const datePart = event.dateOfEvent.split(",")[0];

      // Parse the date (DD.MM.YYYY format)
      const [day, month, year] = datePart.split(".").map(Number);

      // Create event date in Bulgaria timezone (Europe/Sofia)
      const eventDate = new Date(year, month - 1, day); // month is 0-based in JS
      
      // Get current date in Bulgaria timezone (Europe/Sofia)
      const nowInBulgaria = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Sofia"
      });
      const todayInBulgaria = new Date(nowInBulgaria);
      todayInBulgaria.setHours(0, 0, 0, 0); // Reset time to start of day

      // Compare using Bulgaria timezone
      return eventDate < todayInBulgaria;
    } catch (error) {
      console.error(
        `Error processing date for event "${event.summary}":`,
        error,
      );
      return false; // Default to showing the button if there's an error
    }
  };

  // Modify the createCalendar function to add isPast flag
  function createCalendar(year, month, eventsToUse = events) {
    const myCalendar = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to start from Monday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysOfWeek = ["Пон", "Втр", "Сря", "Чет", "Пет", "Съб", "Нед"];

    // Add days of week as the first row
    myCalendar.push(daysOfWeek.map((day) => ({ day, isHeader: true })));

    // Filter dates for current month and year using the provided events array
    const currentMonthEvents = eventsToUse.filter((event) => {
      const [, monthStr, yearStr] = event.dateOfEvent.split(".");
      const eventMonth = parseInt(monthStr) - 1;
      const eventYear = parseInt(yearStr);
      return eventMonth === month && eventYear === year;
    });

    const currentMonthInteractableDates = currentMonthEvents.map(
      (event) => event.dayOfEvent,
    );

    const currentMonthOnlineDates = currentMonthEvents
      .filter((event) => /^https?:\/\/.+/i.test(event.location))
      .map((event) => event.dayOfEvent);
    
    console.log("🟣 Online events for current month:", currentMonthOnlineDates);

    let dayOfMonth = 1;
    let lastNonEmptyRow = 0;

    for (let i = 0; i < 6; i++) {
      myCalendar.push([]);
      let hasContent = false;

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayIndex) {
          myCalendar[i + 1].push({ day: "", isHighlighted: false });
        } else if (dayOfMonth <= daysInMonth) {
          // Get all events for this day
          const dayEvents = currentMonthEvents.filter(
            (event) => parseInt(event.dayOfEvent) === dayOfMonth,
          ); // Check if there are events for this day matching filter criteria
          const isHighlightedSofia = dayEvents.some((event) => {
            const location = event.location.toLowerCase();
            return location.includes("софия") || location.includes("sofia");
          });

          const isHighlightedPlovdiv = dayEvents.some((event) => {
            const location = event.location.toLowerCase();
            return location.includes("пловдив") || location.includes("plovdiv");
          });

          const isHighlightedOnline = dayEvents.some((event) => {
            return /^https?:\/\/.+/i.test(event.location);
          });

          // Apply filtering regardless of event type - MODIFIED LOGIC HERE
          const shouldHighlight =
            !locationFilter || // No filter - show all events
            (locationFilter === "софия" && isHighlightedSofia) || // Sofia filter
            (locationFilter === "пловдив" && isHighlightedPlovdiv) || // Plovdiv filter
            (locationFilter === "online" && isHighlightedOnline); // Online filter

          // Online events logic - only highlight if it passes the location filter
          const isOnline = currentMonthOnlineDates.includes(dayOfMonth);
          const isPast = isDateInPast(year, month, dayOfMonth);
          const isCurrentDay =
            new Date().getDate() === dayOfMonth &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          if (isOnline) {
            console.log(`🟣 Day ${dayOfMonth} is online event`);
          }

          myCalendar[i + 1].push({
            day: dayOfMonth,
            isHighlighted: shouldHighlight, // Simplified
            isHighlightedPlovdiv: shouldHighlight && isHighlightedPlovdiv,
            isHighlightedSofia: shouldHighlight && isHighlightedSofia,
            isOnline: isOnline, // Always show online styling if event is online, regardless of filter
            isPast,
            isCurrentDay,
          });

          dayOfMonth++;
          hasContent = true;
        } else {
          myCalendar[i + 1].push({ day: "", isHighlighted: false });
        }
      }

      if (hasContent) {
        lastNonEmptyRow = i + 1;
      }
    }

    return myCalendar.slice(0, lastNonEmptyRow + 1);
  }

  // Helper function to get filtered events for current month
  const getFilteredEvents = () => {
    // Filter events for current month and year
    let filteredEvents = events.filter((event) => {
      const eventDate = event.dateOfEvent.split(".");
      const eventMonth = parseInt(eventDate[1]) - 1; // Convert to 0-based month
      const eventYear = parseInt(eventDate[2]); // Get the year
      return eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
    });

    // Apply location filter if set
    if (locationFilter === "софия") {
      // Filter for Sofia events (both Cyrillic and Latin) - exclude online events
      filteredEvents = filteredEvents.filter((event) => {
        const location = event.location.toLowerCase();
        const isPhysicalSofia = location.includes("софия") || location.includes("sofia");
        const isOnlineEvent = /^https?:\/\/.+/i.test(event.location);
        return isPhysicalSofia && !isOnlineEvent;
      });
    } else if (locationFilter === "пловдив") {
      // Filter for Plovdiv events (both Cyrillic and Latin) - exclude online events  
      filteredEvents = filteredEvents.filter((event) => {
        const location = event.location.toLowerCase();
        const isPhysicalPlovdiv = location.includes("пловдив") || location.includes("plovdiv");
        const isOnlineEvent = /^https?:\/\/.+/i.test(event.location);
        return isPhysicalPlovdiv && !isOnlineEvent;
      });
    } else if (locationFilter === "online") {
      // Filter for online events (URLs in location)
      filteredEvents = filteredEvents.filter((event) => {
        return /^https?:\/\/.+/i.test(event.location);
      });
    }

    return filteredEvents;
  };

  const createEventList = () => {
    const filteredEvents = getFilteredEvents();

    // Sort events by day of month
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      return parseInt(a.dayOfEvent) - parseInt(b.dayOfEvent);
    });

    // Now map over the sorted events with staggered animations
    return sortedEvents.map((event, index) => {
      let eventCircleClass =
        "EventCircle flex h-10 w-10 items-center justify-center rounded-full text-xl text-white font-rocaTwoRegular";
      if (/^https?:\/\/.+/i.test(event.location)) {
        eventCircleClass += " bg-moetoRazhdanePurple"; // Online events
      } else if (
        event.location.toLowerCase().includes("софия") ||
        event.location.toLowerCase().includes("sofia")
      ) {
        eventCircleClass += " bg-moetoRazhdaneLightGreen"; // Sofia events
      } else if (
        event.location.toLowerCase().includes("пловдив") ||
        event.location.toLowerCase().includes("plovdiv")
      ) {
        eventCircleClass += " bg-moetoRazhdaneDarkGreen"; // Plovdiv events
      }
      let eventTitleClass =
        "EventTitle relative flex items-center justify-start text-right font-magnoliaScript text-2xl ";
      if (/^https?:\/\/.+/i.test(event.location)) {
        eventTitleClass += " text-moetoRazhdanePurple"; // Online events
      } else if (
        event.location.toLowerCase().includes("софия") ||
        event.location.toLowerCase().includes("sofia")
      ) {
        eventTitleClass += " text-gray-400"; // Sofia events - changed to gray for better readability
      } else if (
        event.location.toLowerCase().includes("пловдив") ||
        event.location.toLowerCase().includes("plovdiv")
      ) {
        eventTitleClass += " text-moetoRazhdaneDarkGreen"; // Plovdiv events
      }
      
      // Create subtitle class with event-specific styling
      let eventSubtitleClass = "text-sm font-light italic text-center px-3 leading-relaxed ";
      if (/^https?:\/\/.+/i.test(event.location)) {
        eventSubtitleClass += "text-moetoRazhdanePurple/70"; // Online events
      } else if (
        event.location.toLowerCase().includes("софия") ||
        event.location.toLowerCase().includes("sofia")
      ) {
        eventSubtitleClass += "text-gray-400/70"; // Sofia events
      } else if (
        event.location.toLowerCase().includes("пловдив") ||
        event.location.toLowerCase().includes("plovdiv")
      ) {
        eventSubtitleClass += "text-moetoRazhdaneWhite/50"; // Plovdiv events
      } else {
        eventSubtitleClass += "text-moetoRazhdaneDarkGreen/70"; // Default
      }
      
      return (
        <div
          key={index}
          className={`event-box relative mb-4 w-full rounded bg-white p-4 ring-1 transition-all duration-500 ease-out [filter:drop-shadow(0_4px_3px_rgb(0_87_63_/_0.07))_drop-shadow(0_2px_2px_rgb(0_87_63_/_0.06))] sm:w-80 ${
            isEventInPast(event)
              ? "ring-gray-300"
              : "ring-moetoRazhdaneDarkGreen"
          } ${
            showAnimation
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-4 scale-95 opacity-0"
          }`}
          style={{
            transitionDelay: `${index * 100}ms`, // Stagger the animations
          }}
          onClick={() => handleEventInteraction(event.ID)}
        >
          {/* Day Circle - Positioned in upper left */}
          <div className="EventDay absolute left-4 top-4 flex h-[40px] w-[40px] items-center justify-center">
            <span
              className={`${eventCircleClass} ${isEventInPast(event) ? "!bg-gray-400" : ""}`}
            >
              <div>{event.dayOfEvent}</div>
            </span>
          </div>

          {/* Event Title - Centered */}
          <div className="mt-2 mx-8 flex w-full justify-center">
            <div
              className={`${eventTitleClass} ${isEventInPast(event) ? "!text-gray-500" : ""} text-center`}
            >
              <div
                className={`${event.summary.length > 18 ? "whitespace-pre-wrap" : ""}`}
              >
                {event.summary}
              </div>
            </div>
          </div>

          {/* Secondary Title - First quoted sentence from description */}
          {getFirstQuotedSentence(event.description) && (
            <div className="mt-1 mx-8 flex w-full justify-center">
              <div className={eventSubtitleClass}>
                "{getFirstQuotedSentence(event.description)}"
              </div>
            </div>
          )}

          {/* Expandable Description Section */}
          <div
            className="EventDescription hidden w-full bg-white p-4 text-center font-light text-moetoRazhdaneWhite"
            data-id={event.ID}
          >
            {/* Existing Date Info */}
            <div className="flex items-center gap-2 border-t pt-1">
              <FaCalendarAlt className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
              <div className="EventDescriptionDate">{event.dateOfEvent}</div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <FaClock className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
              <div className="EventDescriptionTime">
                {event.timeStart} - {event.timeEnd}
                <span className="ml-2 text-sm font-medium text-moetoRazhdaneWhite/70">
                  (България / EEST)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-b pb-1">
              {/* Use different icons for online vs physical events */}
              {/^https?:\/\/.+/i.test(event.location) ? (
                <FaDesktop className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
              ) : (
                <FaMapMarkerAlt className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
              )}
              <div className="EventDescriptionLocation text-left">
                {/* Check if location is a URL, show "онлайн събитие", otherwise make it a Google Maps link */}
                {/^https?:\/\/.+/i.test(event.location) ? (
                  <span className="text-moetoRazhdaneWhite">
                    онлайн събитие в Прегърната
                  </span>
                ) : (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-moetoRazhdaneWhite underline hover:text-moetoRazhdanePurple"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {event.location}
                  </a>
                )}
              </div>
            </div>
            {/* Description Button */}
            <button
              onClick={(e) => toggleDescriptionModal(event.ID, e)}
              className="mt-2 w-full text-center font-light text-moetoRazhdaneWhite hover:text-moetoRazhdanePurple transition-colors duration-200 underline"
            >
              Виж повече за събитието...
            </button>
            {/* Only show subscribe button for future events */}
                      {!isEventInPast(event) ? (
                      <div className="flex w-full justify-center">
                      <button
                        className="mt-2 items-center justify-center rounded-2xl bg-moetoRazhdaneYellow p-3 font-rocaTwoRegular text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30"
                        onClick={() => handleClickSubscribeAndPay(event)}
                      >
                        <div className="flex flex-col items-center gap-2">
                        {/^https?:\/\/.+/i.test(event.location) ? (
                        <>
                        <span className="text-xl">ВКЛЮЧИ СЕ С HEARTBEAT</span>
                        </>
                        ) : (
                        'ЗАПИШИ СЕ'
                        )}
                        </div>
                      </button>
                      </div>
                      ) : (
                      <div className="flex w-full justify-center">
                      <div className="mt-2 items-center justify-center rounded-2xl border border-moetoRazhdaneWhite bg-moetoRazhdaneYellow p-3 text-center font-rocaTwoThin text-base font-light text-black">
                    Изминало събитие <br />
                  </div>
                      </div>
                      )}
                    </div>
        </div>
      );
    });
  };

  const filteredEventsForCalendar = getFilteredEvents();
  const myCalendar = createCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    filteredEventsForCalendar,
  );
  const filterSofiaEvents = events.filter((event) => {
    const location = event.location.toLowerCase();
    return location.includes("софия") || location.includes("sofia");
  });

  const filterShowPlovdivEvents = events.filter((event) => {
    const location = event.location.toLowerCase();
    return location.includes("пловдив") || location.includes("plovdiv");
  });

  const monthName = currentDate.toLocaleString("bg-BG", { month: "long" });
  const year = currentDate.getFullYear();
  return (
    <>
      <div className="mb-14 mt-4 flex flex-col gap-6 lg:flex-row lg:justify-between">
      {/* Toast notification with drop animation */}
      <div
        className={`toast fixed left-1/2 top-6 z-[9999] w-4/6 -translate-x-1/2 transform transition-all duration-1000 ease-in-out ${
          showToast
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-16 opacity-0"
        }`}
      >
        <button
          onClick={() => setShowToast(false)}
          className="flex items-center rounded bg-moetoRazhdaneYellow p-3 px-3 py-3 text-center font-rocaTwoRegular text-xl font-black text-black shadow-lg hover:backdrop-opacity-70"
        >
          Записа се успешно! <br />
          Провери пощата си.
        </button>
      </div>

      {/* Display error message if errorState is set */}
      {errorState && (
        <div
          className="error-message rounded-lg bg-red-200 p-4 text-center text-red-700"
          dangerouslySetInnerHTML={{ __html: errorState.message }}
        />
      )}

      <div className="calendar-container w-full flex-1 font-playfairDisplay lg:w-7/12 lg:sticky lg:top-4 lg:self-start lg:max-h-screen lg:overflow-y-auto">
        <div className="calendar-header flex-1 flex-col items-center justify-center font-magnoliaScript">
          <div className="calender-navigation flex items-center justify-center gap-4 p-3 text-center text-6xl">
            <div>
              <button
                onClick={handlePrevMonth}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrevMonth();
                }}
                className="min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-300 hover:opacity-30"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                &lt;
              </button>
            </div>
            <div className="calender-year-month relative flex flex-col items-center justify-center">
              <div className="calender-year absolute -bottom-12 left-1/2 -z-10 -translate-x-1/2 text-9xl leading-none text-gray-300/50">
                {year}
              </div>
              <div className="calender-month relative z-10 text-5xl font-black text-moetoRazhdanePurple">
                {monthName}
              </div>
            </div>
            <div>
              {hasFutureEventsOrIsCurrentCalendarMonth() ? (
                <button
                  onClick={handleNextMonth}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNextMonth();
                  }}
                  className="min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-300 hover:opacity-30"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  &gt;
                </button>
              ) : (
                <div className="group relative">
                  <button
                    disabled
                    className="cursor-not-allowed opacity-10 transition-all duration-300"
                >
                  &gt;
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full right-1/2 z-50 mb-2 -translate-x-0.5 rounded bg-moetoRazhdaneYellow p-3 text-xs font-black text-black opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                    <div className="whitespace-nowrap font-rocaTwoRegular">
                      Няма планирани събития
                      <br /> за следващите месеци.
                    </div>
                    {/* Tooltip arrow */}
                    <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-8 border-solid border-moetoRazhdaneYellow border-b-transparent border-l-transparent border-r-transparent"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="calender-filter mt-4">
            <div className="flex items-center justify-center gap-4 font-rocaTwoThin text-base">
              <button
                onClick={() => toggleLocationFilter("sofia")}
                className={`rounded-xl px-2 py-1 font-black transition-all duration-300 ${
                  locationFilter === "софия"
                    ? "bg-moetoRazhdaneLightGreen text-white ring-2 ring-moetoRazhdaneLightGreen ring-offset-2"
                    : "bg-gray-100 text-moetoRazhdaneLightGreen hover:bg-gray-200"
                }`}
              >
                Събития в София
              </button>
              <button
                onClick={() => toggleLocationFilter("plovdiv")}
                className={`rounded-xl px-2 py-1 font-black transition-all duration-300 ${
                  locationFilter === "пловдив"
                    ? "bg-moetoRazhdaneDarkGreen text-white ring-2 ring-moetoRazhdaneDarkGreen ring-offset-2"
                    : "bg-gray-100 text-moetoRazhdaneDarkGreen hover:bg-gray-200"
                }`}
              >
                Събития в Пловдив
              </button>
              <button
                onClick={() => toggleLocationFilter("online")}
                className={`rounded-xl px-2 py-1 font-black transition-all duration-300 ${
                  locationFilter === "online"
                    ? "bg-moetoRazhdanePurple text-white ring-2 ring-moetoRazhdanePurple ring-offset-2"
                    : "bg-gray-100 text-moetoRazhdanePurple hover:bg-gray-200"
                }`}
              >
                Онлайн събитие 
              </button>
            </div>
          </div>
        </div>
        <div className="myCalendar relative mt-2 flex w-full flex-col items-center">
          <div
            className="calBackground absolute inset-0 left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-10"
            style={{
              backgroundImage: `url(${calBgImage})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              width: "75%",
            }}
          ></div>
          <table className="w-full max-w-3xl text-center font-rocaTwoRegular">
            <tbody>
              {myCalendar.map((week, weekIndex) => (
                <tr key={weekIndex} className="flex justify-center">
                  {week.map((day, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`calendar-cell flex h-12 w-12 items-center justify-center transition-all duration-500 ${
                        day.isHeader
                          ? "font-rocaTwoRegular text-xl font-bold text-moetoRazhdaneDarkGreen"
                          : day.day === ""
                            ? "pointer-events-none font-light"
                            : day.isPast &&
                                !day.isHighlightedSofia &&
                                !day.isHighlightedPlovdiv &&
                                !day.isOnline
                              ? "cursor-pointer opacity-25"
                              : day.isPast
                                ? "highlightedPast cursor-pointer opacity-25"
                                : day.isCurrentDay && day.isOnline
                                  ? "online ring-bg-sky-200 scale-75 rounded-full ring ring-offset-2"
                                  : day.isCurrentDay && day.isHighlightedSofia
                                    ? "highlightedSofia ring-bg-sky-200 scale-75 rounded-full ring ring-offset-2"
                                    : day.isCurrentDay &&
                                        day.isHighlightedPlovdiv
                                      ? "highlightedPlovdiv ring-bg-sky-200 scale-75 rounded-full ring ring-offset-2"
                                      : day.isCurrentDay
                                        ? "ring-bg-sky-200 scale-75 rounded-full ring ring-offset-2"
                                        : day.isOnline
                                          ? "online cursor-pointer"
                                          : day.isHighlightedPlovdiv
                                            ? "highlightedPlovdiv cursor-pointer"
                                            : day.isHighlightedSofia
                                              ? "highlightedSofia cursor-pointer"
                                              : "cursor-default"
                      } ${
                        (day.isHighlightedSofia ||
                          day.isHighlightedPlovdiv ||
                          day.isOnline) &&
                        animatingCalendar
                          ? "animate-event-pop"
                          : ""
                      }`}
                      onClick={() =>
                        !day.isHeader &&
                        day.day !== "" &&
                        (day.isHighlighted || !day.isPast) && // Only allow clicking on days with events or future days
                        handleDayClick(day.day)
                      }
                    >
                      {day.day}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="events-container flex w-full flex-col items-center justify-center lg:mt-0 lg:w-5/12">
        <div className="mb-8 font-magnoliaScript text-4xl font-bold text-moetoRazhdaneDarkGre
        en">
          Събития
        </div>
        {isLoadingEvents ? (
          // Loading state
          <div
            className={`event-box mb-4 grid w-full sm:w-80 grid-cols-[auto_1fr] grid-rows-[min-content] rounded bg-white p-3 ring-1 ring-moetoRazhdaneDarkGreen transition-all duration-500 ease-out [filter:drop-shadow(0_4px_3px_rgb(0_87_63_/_0.07))_drop-shadow(0_2px_2px_rgb(0_87_63_/_0.06))] ${
              showAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <div className="flex h-full items-center">
              <div className="NoEventDay mr-4 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moetoRazhdaneYellow font-rocaTwoRegular text-xl text-black">
                  <div className="animate-spin">⏳</div>
                </span>
              </div>
              <div className="NoEventSummary flex-1 items-center text-balance font-rocaTwoThin text-3xl text-moetoRazhdaneDarkGreen">
                Зареждане на събитията в програмата. Това може да отнеме
                известно време. Моля изчакайте.
              </div>
            </div>
          </div>
        ) : currentMonthEvents.length > 0 ? (
          createEventList()
        ) : (
          // No events state (only shown after loading is complete)
          <div
            className={`event-box mb-4 grid w-full sm:w-80 grid-cols-[auto_1fr] grid-rows-[min-content] rounded bg-white p-3 ring-1 ring-moetoRazhdaneDarkGreen transition-all duration-500 ease-out [filter:drop-shadow(0_4px_3px_rgb(0_87_63_/_0.07))_drop-shadow(0_2px_2px_rgb(0_87_63_/_0.06))] ${
              showAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <div className="flex h-full items-center">
              <div className="NoEventDay mr-4 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moetoRazhdaneDarkGreen font-rocaTwoRegular text-xl text-white">
                  <div className="mb-2">{isCurrentMonthInPast() ? "📅" : "😿"}</div>
                </span>
              </div>
              <div className="NoEventSummary flex-1 items-center text-balance font-rocaTwoThin text-3xl text-moetoRazhdaneDarkGreen">
                {isCurrentMonthInPast() ? (
                  // Past month message
                  locationFilter
                    ? `Няма събития ${locationFilter === "софия" ? "в София" : locationFilter === "пловдив" ? "в Пловдив" : "онлайн"} за този месец в миналото.`
                    : "Няма записани събития за този месец в миналото."
                ) : (
                  // Future month message  
                  locationFilter
                    ? `Няма събития ${locationFilter === "софия" ? "в София" : locationFilter === "пловдив" ? "в Пловдив" : "онлайн"} за този месец.`
                    : "Все още няма събития за този месец. Проверете скоро отново!"
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {ShowSubscribeAndPay && (
        <div
          className={`fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-0 transition-all duration-300 ${
            isBlurred ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`font-montserrat max-w-full rounded bg-slate-50 p-10 transition-all duration-300 ${
              isBlurred ? "scale-95 blur-md" : "scale-100 blur-0"
            }`}
          >
            <SubscribeAndPay onClose={() => setShowSubscribeAndPay(false)} />
          </div>
        </div>
      )}
      </div>

      {/* Description Modal */}
      {modalEventId && createPortal(
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999,
            margin: 0,
            padding: 0
          }}
        >
          <div
            className="bg-white rounded-lg p-6 mx-4 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 999999 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">
                Описание на събитието
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div 
              className="font-light text-gray-700 text-left"
              dangerouslySetInnerHTML={{ 
                __html: events.find(event => event.ID === modalEventId)?.description || '' 
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default MyBirthCalendar;
