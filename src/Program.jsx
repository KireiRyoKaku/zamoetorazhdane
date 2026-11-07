import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import calBgImage from "./assets/pictures/logo-and-text-green-outline.png";

import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaDesktop,
} from "react-icons/fa";
import { API_URL } from "../utils/apiConfig.js";

const bulgarianMonthAbbreviations = [
  "яну",
  "фев",
  "мар",
  "апр",
  "май",
  "юни",
  "юли",
  "авг",
  "сеп",
  "окт",
  "ное",
  "дек",
];

const hasConfiguredEventLocation = (location) =>
  typeof location === "string" &&
  location.trim() !== "" &&
  !/локацията за тази среща все още избира|проверете по-късно пак/i.test(
    location,
  );

const Program = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAnimation, setShowAnimation] = useState(false);
  const [events, setEvents] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [errorState, setErrorState] = useState(null); // Add error state
  const [locationFilter, setLocationFilter] = useState(null); // null, 'na-zhivo', or 'online'
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
    if (!description) return "";

    // Remove HTML tags first
    const textOnly = description.replace(/<[^>]*>/g, "");

    // Look for text between quotes (both " and ")
    const quotedMatch =
      textOnly.match(/[""]([^"""]+)[""]/) || textOnly.match(/"([^"]+)"/);

    if (quotedMatch) {
      return quotedMatch[1].trim();
    }

    return "";
  };

  // Add escape key handler for modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && modalEventId) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [modalEventId]);

  // Move this function INSIDE the component
  const toggleLocationFilter = (location) => {
    // Toggle functionality: if same location is clicked, remove filter
    if (locationFilter === location) {
      setLocationFilter(null);
    } else {
      // Otherwise set the new filter
      setLocationFilter(location);
    }
  };

  useEffect(() => {
    const filter = new URLSearchParams(location.search).get("filter");
    setLocationFilter(
      filter === "online" || filter === "na-zhivo" ? filter : null,
    );
  }, [location.search]);

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
      newDate.setDate(1);
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
    return (
      eventMonth === currentDate.getMonth() &&
      eventYear === currentDate.getFullYear()
    );
  });

  // Keep every month up to the current month reachable, then allow forward
  // navigation only when a later month contains a scheduled event.
  const hasFutureEventsOrIsCurrentCalendarMonth = () => {
    const today = new Date();
    const nextMonth = new Date(currentDate);
    nextMonth.setDate(1);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    nextMonth.setHours(0, 0, 0, 0);

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (nextMonth <= currentMonth) {
      return true;
    }

    return events.some((event) => {
      const datePart = event.dateOfEvent.split(",")[0];
      const [day, month, year] = datePart.split(".").map(Number);
      const eventDate = new Date(year, month - 1, day);
      eventDate.setHours(0, 0, 0, 0);

      return eventDate >= nextMonth;
    });
  };

  const handleNextMonth = () => {
    if (hasFutureEventsOrIsCurrentCalendarMonth()) {
      setCurrentDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(1);
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
      (currentDate.getFullYear() === currentRealYear &&
        currentDate.getMonth() < currentRealMonth)
    );
  };

  const handleClickSubscribeAndPay = (event) => {
    // For online events (URLs), open the link directly
    if (/^https?:\/\/.+/i.test(event.location)) {
      window.open(event.location, "_blank", "noopener,noreferrer");
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
        attachmentUrl: event.attachmentUrl,
      },
    });
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

        const fetchedEvents = await response.json();
        const events = fetchedEvents.filter((event) =>
          hasConfiguredEventLocation(event.location),
        );
        console.log(
          "✅ Events fetched successfully:",
          events.length,
          "events with locations",
        );

        setEvents(events);
      } catch (error) {
        console.error("❌ Error fetching event dates:", error);
        setErrorState({ message: `Failed to load events: ${error.message}` });

        // Fallback to empty state
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
            // Use the more reliable scrollIntoView method with better positioning
            eventBox.scrollIntoView({
              behavior: "smooth",
              block: "center", // Center the event box in the viewport for better visibility
              inline: "nearest",
            });
          }
        }, 200); // Increased delay to ensure description expansion animation has progressed
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

  const handleDayClick = (day, isPast) => {
    const event = currentMonthEvents.find(
      (candidate) =>
        Number(candidate.dayOfEvent) === Number(day) &&
        (!locationFilter ||
          (locationFilter === "online" &&
            /^https?:\/\/.+/i.test(candidate.location)) ||
          (locationFilter === "na-zhivo" &&
            !/^https?:\/\/.+/i.test(candidate.location))),
    );

    if (event) {
      if (isPast) {
        setModalEventId(event.ID);
      } else {
        handleEventInteraction(event.ID);
      }
    }
  };

  // Add this function to check if a date is in the past using Bulgaria timezone
  const isDateInPast = (year, month, day) => {
    // Get current date in Bulgaria timezone (Europe/Sofia)
    const nowInBulgaria = new Date().toLocaleString("en-US", {
      timeZone: "Europe/Sofia",
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
        timeZone: "Europe/Sofia",
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
          );

          // Check if there are events for this day matching filter criteria
          const isHighlightedOnPremise = dayEvents.some((event) => {
            return !/^https?:\/\/.+/i.test(event.location);
          });

          const isHighlightedOnline = dayEvents.some((event) => {
            return /^https?:\/\/.+/i.test(event.location);
          });

          // Apply filtering - simplified for online vs on-premise
          const shouldHighlight =
            !locationFilter || // No filter - show all events
            (locationFilter === "na-zhivo" && isHighlightedOnPremise) || // On-premise filter
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
            isHighlightedOnPremise: shouldHighlight && isHighlightedOnPremise,
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

  // Apply the active location filter to events in both the list and calendar.
  const getFilteredEvents = () => {
    let filteredEvents = events;

    // Apply location filter if set
    if (locationFilter === "na-zhivo") {
      // Filter for on-premise events (exclude online events)
      filteredEvents = filteredEvents.filter((event) => {
        return !/^https?:\/\/.+/i.test(event.location);
      });
    } else if (locationFilter === "online") {
      // Filter for online events (URLs in location)
      filteredEvents = filteredEvents.filter((event) => {
        return /^https?:\/\/.+/i.test(event.location);
      });
    }

    return filteredEvents;
  };

  const upcomingEvents = getFilteredEvents().filter(
    (event) => !isEventInPast(event),
  );

  const createEventList = () => {
    const sortedEvents = [...upcomingEvents].sort((a, b) => {
      const [dayA, monthA, yearA] = a.dateOfEvent
        .split(",")[0]
        .split(".")
        .map(Number);
      const [dayB, monthB, yearB] = b.dateOfEvent
        .split(",")[0]
        .split(".")
        .map(Number);

      return (
        new Date(yearA, monthA - 1, dayA) -
        new Date(yearB, monthB - 1, dayB)
      );
    });

    // Now map over the sorted events with staggered animations
    return sortedEvents.map((event, index) => {
      const eventMonthIndex =
        Number(event.dateOfEvent?.split(",")[0]?.split(".")[1]) - 1;
      const eventMonthAbbreviation =
        bulgarianMonthAbbreviations[eventMonthIndex] ?? "";
      let eventCircleClass =
        "EventCircle flex h-10 w-10 items-center justify-center rounded-full text-xl text-fourth font-rocaTwoRegular";
      if (/^https?:\/\/.+/i.test(event.location)) {
        eventCircleClass += " bg-secondary"; // Online events
      } else {
        eventCircleClass += " bg-primary"; // On-premise events
      }
      let eventTitleClass =
        "EventTitle relative flex min-w-0 items-center justify-start text-left font-magnoliaScript text-xl sm:text-2xl ";
      if (/^https?:\/\/.+/i.test(event.location)) {
        eventTitleClass += " text-fourth"; // Online events
      } else {
        eventTitleClass += " text-fourth"; // On-premise events
      }

      // Create subtitle class with event-specific styling
      let eventSubtitleClass =
        "text-left text-sm font-light italic leading-relaxed ";
      if (/^https?:\/\/.+/i.test(event.location)) {
        eventSubtitleClass += "text-fourth"; // Online events
      } else {
        eventSubtitleClass += "text-fourth/80"; // On-premise events
      }

      return (
        <div
          key={index}
          className={`event-box isolate relative mb-6 w-full overflow-visible rounded ${event.attachmentUrl ? "bg-transparent" : "bg-white/90"} p-4 pt-6 ring-1 transition-all duration-500 ease-out [filter:drop-shadow(0_4px_3px_rgb(0_87_63_/_0.07))_drop-shadow(0_2px_2px_rgb(0_87_63_/_0.06))] sm:w-full sm:max-w-xl ${
            isEventInPast(event)
              ? "ring-gray-300"
              : "ring-primary"
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
          {event.attachmentUrl && (
            <div
              aria-hidden="true"
              className="event-card-background pointer-events-none absolute inset-0 z-0 overflow-hidden rounded"
            >
              <img
                src={event.attachmentUrl}
                alt=""
                loading="lazy"
                className="h-full w-full scale-105 object-cover blur-sm opacity-40"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-white/65" />
            </div>
          )}
          {/* Date badge overlaps the card's upper-left corner. */}
          <div className="EventDay absolute -left-3 -top-4 z-20 flex min-w-10 flex-col items-center">
            <span className="mb-0.5 text-xs font-bold uppercase leading-none text-fourth">
              {eventMonthAbbreviation}
            </span>
            <span
              className={`${eventCircleClass} ${isEventInPast(event) ? "!bg-secondary" : ""}`}
            >
              {event.dayOfEvent}
            </span>
          </div>

          {/* Reserve room for the date badge and keep long titles inside the card. */}
          <div className="relative z-10 mt-2 flex w-full min-w-0 justify-start pl-10">
            <div
              className={`${eventTitleClass} ${isEventInPast(event) ? "!text-fourth" : ""}`}
            >
              <div className="min-w-0 max-w-full whitespace-normal break-words [overflow-wrap:anywhere]">
                {event.summary}
              </div>
            </div>
          </div>

          {/* Secondary Title - First quoted sentence from description */}
          {getFirstQuotedSentence(event.description) && (
            <div className="relative z-10 mt-1 flex w-full min-w-0 justify-start pl-10">
              <div
                className={`${eventSubtitleClass} min-w-0 max-w-full break-words [overflow-wrap:anywhere]`}
              >
                "{getFirstQuotedSentence(event.description)}"
              </div>
            </div>
          )}

          {/* Expandable Description Section */}
          <div
            className="EventDescription relative z-10 hidden w-full bg-white/85 p-4 text-left font-light text-fourth"
            data-id={event.ID}
          >
            {event.attachmentUrl && (
              <img
                src={event.attachmentUrl}
                alt=""
                loading="lazy"
                className="mb-3 h-40 w-full rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {/* Existing Date Info */}
            <div className="flex min-w-0 flex-nowrap items-center justify-start gap-2 border-t pt-1 text-xs sm:text-sm">
              <FaCalendarAlt className="h-4 w-4 flex-none text-fourth opacity-75" />
              <div className="EventDescriptionDate min-w-0 flex-1 truncate whitespace-nowrap">
                {event.dateOfEvent}
              </div>
            </div>
            <div className="flex min-w-0 flex-nowrap items-center justify-start gap-2 pb-1 text-xs sm:text-sm">
              <FaClock className="h-4 w-4 flex-none text-fourth opacity-75" />
              <div className="EventDescriptionTime min-w-0 flex-1 truncate whitespace-nowrap">
                {event.timeStart} - {event.timeEnd}
                <span className="ml-1 text-[10px] font-medium text-fourth/70 sm:ml-2 sm:text-sm">
                  (UTC+3)
                </span>
              </div>
            </div>
            <div className="flex min-w-0 flex-nowrap items-center justify-start gap-2 border-b pb-1 text-xs sm:text-sm">
              {/* Use different icons for online vs physical events */}
              {/^https?:\/\/.+/i.test(event.location) ? (
                <FaDesktop className="h-4 w-4 flex-none text-fourth opacity-75" />
              ) : (
                <FaMapMarkerAlt className="h-4 w-4 flex-none text-fourth opacity-75" />
              )}
              <div className="EventDescriptionLocation min-w-0 flex-1 truncate whitespace-nowrap text-left">
                {/* Check if location is a URL, show "онлайн събитие", otherwise make it a Google Maps link */}
                {/^https?:\/\/.+/i.test(event.location) ? (
                  <span className="text-fourth">
                    онлайн събитие в Прегърната
                  </span>
                ) : (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate whitespace-nowrap text-fourth underline hover:text-fourth"
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
              className="mt-2 w-full text-center font-light text-fourth underline transition-colors duration-200 hover:text-fourth"
            >
              Подробности...
            </button>
            {/* Only show subscribe button for future events */}
            {!isEventInPast(event) ? (
              <div className="flex w-full flex-col items-center justify-center">
                {/* Show club membership message for online events */}
                {/^https?:\/\/.+/i.test(event.location) && (
                  <div className="mb-1 mt-2 px-4 text-center text-sm font-light text-fourth">
                    Събитието е достъпно за членове на клуба. Можеш да се
                    включиш по всяко време.
                  </div>
                )}
                <button
                  className="mt-2 items-center justify-center rounded-2xl bg-third p-3 font-rocaTwoRegular text-2xl font-black text-fourth transition-all duration-500 ease-in-out hover:bg-transparent hover:text-fourth/30"
                  onClick={() => handleClickSubscribeAndPay(event)}
                >
                  <div className="flex flex-col items-center gap-2">
                    {/^https?:\/\/.+/i.test(event.location) ? (
                      <>
                        <span className="text-xl">
                          СТАНИ ЧАСТ ОТ ПРЕГЪРНАТА
                        </span>
                      </>
                    ) : (
                      "ЗАПИШИ СЕ"
                    )}
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex w-full justify-center">
                <div className="mt-2 items-center justify-center rounded-2xl border border-primary bg-third p-3 text-center font-rocaTwoThin text-base font-light text-fourth">
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

  const monthName = currentDate.toLocaleString("bg-BG", { month: "long" });
  const year = currentDate.getFullYear();
  const modalEvent = events.find((event) => event.ID === modalEventId);
  const monthNavigation = (
    <section className="relative z-20 w-full font-magnoliaScript">
      <div className="calender-navigation mx-auto grid w-full max-w-md grid-cols-[36px_minmax(0,1fr)_36px] items-center gap-1 p-2 text-center">
        <button
          onClick={handlePrevMonth}
          className="flex h-9 w-9 items-center justify-center text-4xl transition-opacity duration-300 hover:opacity-30"
          style={{ WebkitTapHighlightColor: "transparent" }}
          aria-label="Предишен месец"
        >
          &lt;
        </button>
        <div className="calender-year-month relative isolate flex min-w-0 flex-col items-center justify-center">
          <div className="calender-year pointer-events-none absolute inset-0 z-0 flex items-center justify-center text-7xl leading-none text-fourth/15 sm:text-8xl">
            {year}
          </div>
          <div className="calender-month relative z-10 whitespace-nowrap text-3xl font-black text-fourth sm:text-4xl">
            {monthName}
          </div>
        </div>
        {hasFutureEventsOrIsCurrentCalendarMonth() ? (
          <button
            onClick={handleNextMonth}
            className="flex h-9 w-9 items-center justify-center text-4xl transition-opacity duration-300 hover:opacity-30"
            style={{ WebkitTapHighlightColor: "transparent" }}
            aria-label="Следващ месец"
          >
            &gt;
          </button>
        ) : (
          <div className="group relative flex h-9 w-9 items-center justify-center">
            <button
              disabled
              aria-label="Няма планирани събития за следващите месеци"
              className="flex h-9 w-9 cursor-not-allowed items-center justify-center text-4xl opacity-10 transition-opacity duration-300"
            >
              &gt;
            </button>
            <div className="absolute bottom-full right-1/2 z-50 mb-2 -translate-x-0.5 rounded bg-third p-3 text-xs font-black text-fourth opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
              <div className="whitespace-nowrap font-rocaTwoRegular">
                Няма планирани събития
                <br /> за следващите месеци.
              </div>
              <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-8 border-solid border-third border-b-transparent border-l-transparent border-r-transparent"></div>
            </div>
          </div>
        )}
      </div>
      <div className="calender-filter mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2 font-rocaTwoThin text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => toggleLocationFilter("na-zhivo")}
            className={`rounded-xl px-2 py-1 font-black transition-all duration-300 ${
              locationFilter === "na-zhivo"
                ? "bg-primary text-fourth ring-2 ring-fourth ring-offset-2"
                : "bg-primary text-fourth hover:bg-primary/80"
            }`}
          >
            Събития на живо
          </button>
          <button
            type="button"
            onClick={() => toggleLocationFilter("online")}
            className={`rounded-xl px-2 py-1 font-black transition-all duration-300 ${
              locationFilter === "online"
                ? "bg-secondary text-fourth ring-2 ring-fourth ring-offset-2"
                : "bg-secondary text-fourth hover:bg-secondary/80"
            }`}
          >
            Онлайн събития
          </button>
        </div>
      </div>
    </section>
  );
  return (
    <main className="bg-primary px-4 py-8">
      <div className="mx-auto mb-14 mt-4 grid w-full max-w-7xl grid-cols-1 items-start gap-8 rounded-2xl bg-white/65 p-4 shadow-lg sm:p-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] lg:gap-10">
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
            className="flex items-center rounded bg-third p-3 px-3 py-3 text-center font-rocaTwoRegular text-xl font-black text-fourth shadow-lg hover:backdrop-opacity-70"
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

        <div className="calendar-container program-calendar order-2 w-full font-playfairDisplay lg:order-2">
          <div className="myCalendar relative mt-2 flex w-full flex-col items-center rounded-2xl bg-white/80 p-4 shadow-sm">
            <div
              className="calBackground absolute inset-0 left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
              style={{
                backgroundImage: `url(${calBgImage})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                width: "75%",
              }}
            ></div>
            <table className="relative z-10 w-auto text-center font-rocaTwoRegular">
              <tbody>
                {myCalendar.map((week, weekIndex) => (
                  <tr key={weekIndex} className="flex justify-center">
                    {week.map((day, dayIndex) => (
                      <td
                        key={dayIndex}
                        className={`calendar-cell flex h-8 w-8 items-center justify-center text-fourth transition-all duration-500 ${
                          day.isHeader
                            ? "font-rocaTwoRegular text-xl font-bold text-fourth"
                            : day.day === ""
                              ? "pointer-events-none font-light"
                              : day.isPast &&
                                  !day.isHighlightedOnPremise &&
                                  !day.isOnline
                                ? "cursor-pointer opacity-60"
                                : day.isPast
                                  ? "highlightedPast cursor-pointer opacity-60"
                                  : day.isCurrentDay && day.isOnline
                                    ? "online ring-fourth scale-75 rounded-full ring ring-offset-2"
                                    : day.isCurrentDay &&
                                        day.isHighlightedOnPremise
                                      ? "highlightedOnPremise ring-fourth scale-75 rounded-full ring ring-offset-2"
                                      : day.isCurrentDay
                                        ? "ring-fourth scale-75 rounded-full ring ring-offset-2"
                                        : day.isOnline
                                          ? "online cursor-pointer"
                                          : day.isHighlightedOnPremise
                                            ? "highlightedOnPremise cursor-pointer"
                                            : "cursor-default"
                        } ${
                          (day.isHighlightedOnPremise || day.isOnline) &&
                          animatingCalendar
                            ? "animate-event-pop"
                            : ""
                        }`}
                        onClick={() =>
                          !day.isHeader &&
                          day.day !== "" &&
                          (day.isHighlighted || !day.isPast) &&
                          handleDayClick(day.day, day.isPast)
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

        <div className="events-container order-1 flex w-full flex-col items-center justify-center lg:order-1">
          <div className="mb-6 font-magnoliaScript text-4xl font-bold text-fourth">
            Събития
          </div>
          {isLoadingEvents ? (
            // Loading state
            <div
              className={`event-box mb-4 grid w-full grid-cols-[auto_1fr] grid-rows-[min-content] rounded bg-white/90 p-3 ring-1 ring-primary transition-all duration-500 ease-out [filter:drop-shadow(0_4px_3px_rgb(0_87_63_/_0.07))_drop-shadow(0_2px_2px_rgb(0_87_63_/_0.06))] sm:w-full sm:max-w-xl ${
                showAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"
              }`}
            >
              <div className="flex h-full items-center">
                <div className="NoEventDay mr-4 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-third font-rocaTwoRegular text-xl text-fourth">
                    <div className="animate-spin">⏳</div>
                  </span>
                </div>
                <div className="NoEventSummary flex-1 items-center text-balance font-rocaTwoThin text-3xl text-fourth">
                  Зареждане на събитията в програмата. Това може да отнеме
                  известно време. Моля изчакайте.
                </div>
              </div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            createEventList()
          ) : (
            <div
              className={`event-box mb-4 grid w-full grid-cols-[auto_1fr] grid-rows-[min-content] rounded bg-white/90 p-3 ring-1 ring-primary transition-all duration-500 ease-out [filter:drop-shadow(0_4px_3px_rgb(0_87_63_/_0.07))_drop-shadow(0_2px_2px_rgb(0_87_63_/_0.06))] sm:w-full sm:max-w-xl ${
                showAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"
              }`}
            >
              <div className="flex h-full items-center">
                <div className="NoEventDay mr-4 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-rocaTwoRegular text-xl text-fourth">
                    <div className="mb-2">
                      {isCurrentMonthInPast() ? "📅" : "😿"}
                    </div>
                  </span>
                </div>
                <div className="NoEventSummary flex-1 items-center text-balance font-rocaTwoThin text-3xl text-fourth">
                  {locationFilter
                    ? `Няма предстоящи събития ${locationFilter === "na-zhivo" ? "на живо" : "онлайн"}.`
                    : "Все още няма предстоящи събития. Проверете скоро отново!"}
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 w-full">{monthNavigation}</div>
        </div>
      </div>

      {/* Description Modal */}
      {modalEventId &&
        createPortal(
          <div
            className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-50"
            onClick={closeModal}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 999999,
              margin: 0,
              padding: 0,
            }}
          >
            <div
              className="relative isolate mx-4 max-h-[80vh] w-full min-w-0 max-w-lg overflow-x-hidden overflow-y-auto rounded-lg bg-primary p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              style={{ zIndex: 999999 }}
            >
              {modalEvent?.attachmentUrl && (
                <img
                  src={modalEvent.attachmentUrl}
                  alt=""
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="min-w-0 max-w-full">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h3 className="text-lg font-medium text-fourth">
                  {modalEvent?.summary}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-xl font-bold text-fourth hover:text-fourth"
                  aria-label="Затвори"
                >
                  ×
                </button>
              </div>
              <div className="mb-3 space-y-1 border-b border-primary pb-3 text-sm text-fourth">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4 flex-none text-fourth" />
                  <span>{modalEvent?.dateOfEvent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="h-4 w-4 flex-none text-fourth" />
                  <span>
                    {modalEvent?.timeStart} - {modalEvent?.timeEnd} (UTC+3)
                  </span>
                </div>
              </div>
              <div
                className="event-description-content min-w-0 max-w-full text-left font-light text-fourth [&_p]:mb-3 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{
                  __html: modalEvent?.description || "",
                }}
              />
              <div className="mt-4 flex items-start gap-2 border-t border-primary pt-3 text-sm text-fourth">
                {/^https?:\/\/.+/i.test(modalEvent?.location ?? "") ? (
                  <>
                    <FaDesktop className="mt-0.5 h-4 w-4 flex-none text-fourth" />
                    <a
                      href={modalEvent.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all underline hover:text-fourth"
                    >
                      онлайн събитие в Прегърната
                    </a>
                  </>
                ) : (
                  <>
                    <FaMapMarkerAlt className="mt-0.5 h-4 w-4 flex-none text-fourth" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(modalEvent?.location ?? "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 break-words underline hover:text-fourth [overflow-wrap:anywhere]"
                    >
                      {modalEvent?.location}
                    </a>
                  </>
                )}
              </div>
              {modalEvent && !isEventInPast(modalEvent) && (
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    handleClickSubscribeAndPay(modalEvent);
                  }}
                  className="mt-4 w-full rounded-2xl bg-third px-4 py-3 text-center font-rocaTwoRegular text-xl font-black text-fourth transition-colors hover:bg-third/80"
                >
                  {/^https?:\/\/.+/i.test(modalEvent.location)
                    ? "СТАНИ ЧАСТ ОТ ПРЕГЪРНАТА"
                    : "ЗАПИШИ СЕ"}
                </button>
              )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
};

export default Program;
