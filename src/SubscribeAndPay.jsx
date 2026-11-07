import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { differenceInHours } from "date-fns";
import { API_URL } from "../utils/apiConfig.js";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaDesktop,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const SubscribeAndPay = () => {
  const location = useLocation();
  const { eventId } = useParams(); // Get the eventId from URL params
  const [isLoading, setIsLoading] = useState(false);

  // State to store event details fetched from API
  const [eventDetails, setEventDetails] = useState({
    eventSummary: "",
    eventDate: "",
    eventDateLocaleString: "",
    eventTime: "",
    eventLocation: "",
    eventDescription: "",
    eventType: "",
    attachmentUrl: "",
  });

  // Extract from location.state (if available) or use event details state
  const {
    eventSummary = eventDetails.eventSummary || "",
    eventDate = eventDetails.eventDate || "",
    eventDateLocaleString = eventDetails.eventDateLocaleString || "",
    eventTime = eventDetails.eventTime || "",
    eventLocation = eventDetails.eventLocation || "",
    eventDescription = eventDetails.eventDescription || "",
    eventType = eventDetails.eventType || "",
    attachmentUrl = eventDetails.attachmentUrl || "",
  } = location.state || {};

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showParticipantInfoPopup, setShowParticipantInfoPopup] =
    useState(false);

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousDocumentOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousDocumentOverflow;
    };
  }, []);

  const [formData, setFormData] = useState({
    event: eventSummary || "",
    eventDate: eventDate || "",
    eventTime: eventTime || "",
    eventLocation: eventLocation || "",
    email: "",
    name: "", // This will be participant 1 name
    phone: "",
    source: "",
    participantCount: 1,
    participantNames: ["", "", "", "", ""], // Names for participants 1-5
  });

  // Fetch event details if accessed via URL with eventId
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (eventId && (!location.state || !location.state.eventSummary)) {
        try {
          setIsLoading(true);
          console.log(`Fetching events for ID: ${eventId}`);

          // Fetch all events and find the one with matching ID
          const response = await fetch(`${API_URL}/events`);

          if (!response.ok) {
            throw new Error(`Failed to fetch events: ${response.status}`);
          }

          const events = await response.json();
          console.log(
            `Fetched ${events.length} events, looking for event with ID: ${eventId}`,
          );

          // Find the matching event by cID
          const event = events.find((ev) => ev.cID === eventId);

          if (event) {
            console.log("Found event:", event);

            // Update the event details state
            setEventDetails({
              eventSummary: event.summary || "",
              eventDate: event.dateOfEvent || "",
              eventDateLocaleString: event.dateOfEventLocaleString || "",
              eventTime: event.timeStart || "",
              eventLocation: event.location || "",
              eventDescription: event.description || "",
              eventType: event.type || "",
              attachmentUrl: event.attachmentUrl || "",
            });

            // Update form data
            setFormData((prev) => ({
              ...prev,
              event: event.summary || "",
              eventDate: event.dateOfEvent || "",
              eventTime: event.timeStart || "",
              eventLocation: event.location || "",
            }));
          } else {
            throw new Error(`Event with ID ${eventId} not found`);
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
          setError(
            "Не можем да намерим детайли за това събитие. Моля проверете URL адреса или изберете събитие от програмата.",
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEventDetails();
  }, [eventId, location.state, API_URL]);

  const currentDate = new Date();

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

  // Function to get background color based on event location
  const getEventTypeStyle = () => {
    // Check for Sofia
    if (
      eventLocation &&
      (eventLocation.toLowerCase().includes("софия") ||
        eventLocation.toLowerCase().includes("sofia"))
    ) {
      return "bg-primary text-fourth"; // Sofia events - light green
    }
    // Check for Plovdiv (default for subscription events)
    else {
      return "bg-primary text-fourth"; // Plovdiv events
    }
  };

  // Create proper event datetime by combining eventDateLocaleString and eventTime
  const getEventDateTime = () => {
    if (eventDateLocaleString.includes("T")) {
      // If it's already an ISO string, use it directly
      return new Date(eventDateLocaleString);
    } else {
      // If it's just a date string, combine with time
      const eventDateTime = new Date(eventDateLocaleString);
      if (eventTime) {
        const [hours, minutes] = eventTime.split(":").map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);
      }
      return eventDateTime;
    }
  };

  const priceOneTime = () => {
    let difference = differenceInHours(getEventDateTime(), currentDate);
    let basePrice = difference < 72 ? 40 : 35; // Late: 40 lv, On-time: 35 lv
    let memberPrice = difference < 72 ? 30 : 25; // Late: 30 lv, On-time: 25 lv for members
    const count = formData.participantCount;

    // Calculate member pricing: discount for 1 person + regular price for additional participants
    const memberTotalPrice = memberPrice + basePrice * (count - 1);
    const nonMemberTotalPrice = basePrice * count;

    // Calculate hours until price increases (if applicable)
    const hoursUntilIncrease = Math.max(0, difference - 72);
    const daysUntilIncrease = Math.ceil(hoursUntilIncrease / 24);
    const willPriceIncrease = difference > 72;

    // Calculate the actual date when price will increase (72 hours before event)
    const priceIncreaseDate = new Date(getEventDateTime());
    priceIncreaseDate.setHours(priceIncreaseDate.getHours() - 72);
    const priceIncreaseDateString = priceIncreaseDate.toLocaleDateString(
      "bg-BG",
      {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      },
    );

    return (
      <div className="space-y-2">
        {/* Price increase warning - only show if price will increase */}
        {willPriceIncrease && (
          <div className="rounded-md border border-primary bg-primary p-2">
            <p className="text-center text-base text-fourth">
              💡Таксата ще се увеличи в последните 3 дни преди преди събитието,
              на{" "}
            </p>
            <p className="text-center">
              <b>{priceIncreaseDateString}</b>
            </p>
          </div>
        )}

        <div className="space-y-1">
          <div className="font-bold text-fourth">
            {count === 1
              ? `Редовна такса: ${nonMemberTotalPrice} лв.`
              : `Редовна такса: ${nonMemberTotalPrice} лв. (${basePrice} лв. x ${count})`}
            {willPriceIncrease && (
              <span className="ml-2 text-xs font-normal text-fourth">
                (или {(basePrice + 5) * count} лв. при късно запсиване)
              </span>
            )}
          </div>
          <div className="font-bold text-fourth">
            {count === 1
              ? `С отстъпка за членове на "Прегърната": ${memberTotalPrice} лв.`
              : `С отстъпка за членове на "Прегърната": ${memberTotalPrice} лв. (${memberPrice} лв. + ${basePrice} лв. x ${count - 1})`}
            {willPriceIncrease && (
              <p>
                <span className="ml-2 text-xs font-normal text-fourth">
                  (или{" "}
                  {Math.max(20, basePrice + 5 - 10) +
                    (basePrice + 5) * (count - 1)}{" "}
                  лв. при късно запсиване)
                </span>
              </p>
            )}
            {count > 1 && (
              <div className="mt-1 text-sm font-normal text-fourth">
                * само първият участник може да бъде таксуван като член
              </div>
            )}
          </div>
        </div>
        <div className="text-sm text-fourth">
          * Валидната за теб крайна сума ще бъде изчислена според членството ти
          в потвърдителния имейл.
        </div>
      </div>
    );
  };

  const handlePrice = () => {
    let difference = differenceInHours(getEventDateTime(), currentDate);
    let basePrice = difference < 72 ? 40 : 35; // Late: 40 lv, On-time: 35 lv
    let memberPrice = difference < 72 ? 30 : 25; // Late: 30 lv, On-time: 25 lv for members
    const count = formData.participantCount;

    // Calculate member pricing: discount for 1 person + regular price for additional participants
    const memberTotalPrice = memberPrice + basePrice * (count - 1);
    const nonMemberTotalPrice = basePrice * count;

    return `Еднократно: Нечленове ${nonMemberTotalPrice} лв. ${count > 1 ? `(${basePrice} x ${count})` : ""} | Членове ${memberTotalPrice} лв. ${count > 1 ? `(${memberPrice} + ${basePrice} x ${count - 1})` : ""}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Calculate price for submission
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    const difference = (eventDateTime - now) / (1000 * 60 * 60); // hours

    let basePrice = difference < 72 ? 40 : 35; // Late: 40 lv, On-time: 35 lv
    let calculatedPrice = basePrice * formData.participantCount;

    const submissionData = {
      ...formData,
      event: eventSummary,
      eventDate,
      price: calculatedPrice,
    };

    try {
      console.log("Sending form data:", submissionData);

      const response = await fetch(`${API_URL}/submit-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        // Extract the actual error message from server response
        let errorMessage = `HTTP error! Status: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            // Keep the default message
          }
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ Form submitted successfully:", result);

      // Only navigate on success
      navigate("/program", { state: { showSuccessToast: true } });
    } catch (err) {
      setError("Connection error: " + (err.message || "Unknown error"));
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name field validation function
    const validateNameField = (inputValue) => {
      // Allow Bulgarian Cyrillic, Latin letters, spaces, hyphens, and apostrophes
      let filtered = inputValue.replace(/[^а-яА-Яa-zA-Z\s\-']/g, "");

      // Limit to reasonable name length
      if (filtered.length > 50) {
        filtered = filtered.slice(0, 50);
      }

      // Prevent multiple consecutive spaces
      filtered = filtered.replace(/\s{2,}/g, " ");

      // Prevent starting with space or hyphen
      filtered = filtered.replace(/^[\s\-]/, "");

      return filtered;
    };

    // Handle participant count changes
    if (name === "participantCount") {
      const count = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        participantCount: count,
        // Update the main name field to be the first participant
        name: prev.participantNames[0] || prev.name,
      }));
    }
    // Handle participant name changes with validation
    else if (name.startsWith("participantName_")) {
      const index = parseInt(name.split("_")[1]);
      const validatedValue = validateNameField(value);
      setFormData((prev) => {
        const newParticipantNames = [...prev.participantNames];
        newParticipantNames[index] = validatedValue;
        return {
          ...prev,
          participantNames: newParticipantNames,
          // Keep the main name field synced with first participant
          name: index === 0 ? validatedValue : prev.name,
        };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Function to add another participant
  const addParticipant = () => {
    if (formData.participantCount < 5) {
      // Check if we're adding the first additional participant (going from 1 to 2)
      if (formData.participantCount === 1) {
        setShowParticipantInfoPopup(true);
      }

      setFormData((prev) => ({
        ...prev,
        participantCount: prev.participantCount + 1,
      }));
    }
  };

  // Function to remove a participant
  // Function to remove a participant
  const removeParticipant = () => {
    if (formData.participantCount > 1) {
      setFormData((prev) => ({
        ...prev,
        participantCount: prev.participantCount - 1,
        // Clear the name of the removed participant
        participantNames: prev.participantNames.map((name, index) =>
          index === prev.participantCount - 1 ? "" : name,
        ),
      }));
    }
  };

  return (
    createPortal(
    <div className="fixed inset-0 z-[10000] h-[100dvh] w-screen overflow-hidden bg-primary/60">
      <div className="subscribe-and-pay-container h-full w-full overflow-x-hidden overflow-y-auto bg-primary p-5 shadow-lg sm:p-6">
      <button
        type="button"
        onClick={() => navigate("/program")}
        className="fixed right-3 top-3 z-[10001] flex h-11 w-11 items-center justify-center rounded-full bg-primary text-3xl text-fourth shadow-md transition-colors hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Затвори прозореца"
        title="Затвори"
      >
        <IoClose aria-hidden="true" />
      </button>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner
            size="lg"
            color="green"
            text="Зареждане на събитие..."
          />
          <p className="mt-4 text-center text-fourth">
            Моля изчакайте, докато зареждаме детайлите за събитието...
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-center text-2xl font-bold">Записване за</h2>
          {attachmentUrl && (
            <img
              src={attachmentUrl}
              alt=""
              className="mx-auto mt-3 h-36 w-full max-w-2xl rounded-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          <h1 className="EventSummary min-w-0 max-w-full">
            <p className="EventName min-w-0 max-w-full break-words py-2 text-center font-magnoliaScript text-3xl text-fourth [overflow-wrap:anywhere]">
              {eventSummary}
            </p>

            {/* Secondary Title - First quoted sentence from description */}
            {getFirstQuotedSentence(eventDescription) && (
              <div className="mt-1 flex min-w-0 w-full justify-center">
                <div className="min-w-0 max-w-full break-words px-3 text-center text-base font-light italic leading-relaxed text-fourth [overflow-wrap:anywhere]">
                  "{getFirstQuotedSentence(eventDescription)}"
                </div>
              </div>
            )}

            {/* Event Date, Time and Location - styled like MyBirthCalendar */}
            <div className="mt-4 space-y-0 text-fourth">
              {/* Date */}
              <div className="flex items-center gap-2 border-t pt-1">
                <FaCalendarAlt className="h-4 w-4 text-fourth opacity-75" />
                <div className="EventDescriptionDate">{eventDate}</div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 pb-1">
                <FaClock className="h-4 w-4 text-fourth opacity-75" />
                <div className="EventDescriptionTime">
                  {eventTime}
                  <span className="ml-2 text-sm font-medium text-fourth/70">
                    (UTC+3)
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 border-b pb-1">
                {/* Use different icons for online vs physical events */}
                {/^https?:\/\/.+/i.test(eventLocation) ? (
                  <FaDesktop className="h-4 w-4 text-fourth opacity-75" />
                ) : (
                  <FaMapMarkerAlt className="h-4 w-4 text-fourth opacity-75" />
                )}
                <div className="EventDescriptionLocation text-left">
                  {/* Check if location is a URL, show "онлайн събитие", otherwise make it a Google Maps link */}
                  {/^https?:\/\/.+/i.test(eventLocation) ? (
                    <span className="text-fourth">
                      онлайн събитие в Прегърната
                    </span>
                  ) : (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 break-words text-fourth underline transition-colors duration-200 hover:text-fourth [overflow-wrap:anywhere]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {eventLocation}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </h1>
        </>
      )}
      {!isLoading && (
        <>
          {/* Event Description at the top */}
          {eventDescription && (
            <section
              className={`event-description mb-6 mt-4 min-w-0 w-full overflow-hidden rounded-lg ${getEventTypeStyle()}`}
            >
              <div className="p-4">
                <button
                  type="button"
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="w-full text-center text-lg font-bold transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  aria-expanded={isDescriptionExpanded}
                >
                  {isDescriptionExpanded
                    ? "Описание"
                    : "Виж повече за събитето..."}
                </button>
                {isDescriptionExpanded && (
                  <div
                    className="event-description-content mt-3 min-w-0 max-w-full break-words text-left [overflow-wrap:anywhere]"
                    dangerouslySetInnerHTML={{ __html: eventDescription }}
                  />
                )}
              </div>
            </section>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-3 text-4xl font-normal text-fourth"
          >
            {/* Email field - always show first */}
            <div>
              <label className="block text-xl font-medium text-fourth">
                E-Mail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border text-base shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            {/* First participant name field - separate and required */}
            <div>
              <label className="block text-xl font-medium text-fourth">
                Име и фамилия<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="participantName_0"
                value={formData.participantNames[0] || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border text-base shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-fourth">
                Телефон за връзка <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value;

                  // Only allow digits, plus sign, spaces, parentheses, and hyphens
                  value = value.replace(/[^\d+\s()\-]/g, "");

                  // Limit length to reasonable phone number length
                  if (value.length > 20) {
                    value = value.slice(0, 20);
                  }

                  // Create a synthetic event with the filtered value
                  const syntheticEvent = {
                    target: {
                      name: "phone",
                      value: value,
                    },
                  };
                  handleChange(syntheticEvent);
                }}
                title="Въведете валиден телефонен номер за връзка"
                required
                className="mt-1 block w-full rounded-md border text-base shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <div className="mt-2 space-y-4">
                {/* Pricing display */}
                <div className="rounded-md border border-primary bg-primary p-3">
                  <span className="text-base text-fourth">
                    {priceOneTime()}
                  </span>
                </div>

                {/* Simple notification popup - appears only after adding first additional participant */}
                {showParticipantInfoPopup && (
                  <div className="rounded-lg border-l-4 border-primary bg-primary p-4 shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-fourth"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-fourth">
                          От тук можеш да запишеш и допълнителни участници (ако
                          решиш да доведеш приятелка).
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          type="button"
                          className="inline-flex rounded-md bg-primary text-fourth hover:text-fourth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-primary"
                          onClick={() => setShowParticipantInfoPopup(false)}
                        >
                          <span className="sr-only">Затвори</span>
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add participant button */}
                {formData.participantCount < 5 && (
                  <button
                    type="button"
                    onClick={addParticipant}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-fourth transition-colors duration-200 hover:bg-primary"
                  >
                    <span>+ добави място</span>
                    <span className="text-lg">
                      ({formData.participantCount}/5)
                    </span>
                    {/* Information icon button inside the add button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent button
                        setShowParticipantInfoPopup(true);
                      }}
                      className="flex rounded-full bg-primary bg-opacity-20 p-1 transition-colors duration-200 hover:bg-opacity-30"
                      title="Информация за допълнителни участници"
                    >
                      <svg
                        className="h-4 w-4 text-fourth"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </button>
                )}

                {/* Remove participant button (only show if more than 1) */}
                {formData.participantCount > 1 && (
                  <button
                    type="button"
                    onClick={removeParticipant}
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-xl font-medium text-fourth transition-colors duration-200 hover:bg-red-700"
                  >
                    - премахни място ({formData.participantCount}/5)
                  </button>
                )}

                {/* Dynamic participant name fields - appear below buttons (additional participants only) */}
                {formData.participantCount > 1 && (
                  <div className="mt-4 space-y-3">
                    {Array.from(
                      { length: formData.participantCount - 1 },
                      (_, index) => {
                        const actualIndex = index + 1; // Start from participant 2
                        return (
                          <div
                            key={actualIndex}
                            className="rounded-lg border border-primary bg-primary p-4 shadow-sm"
                          >
                            <label className="mb-2 block text-base font-medium text-fourth">
                              Участник {actualIndex + 1} - Име и фамилия
                            </label>
                            <input
                              type="text"
                              name={`participantName_${actualIndex}`}
                              value={
                                formData.participantNames[actualIndex] || ""
                              }
                              onChange={handleChange}
                              required={false} // Additional participants are not required
                              className="block w-full rounded-md border-primary p-3 text-base shadow-sm focus:border-primary focus:ring-primary"
                            />
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xl font-medium text-fourth">
                От къде научи за &quot;Прегърната&quot;?{" "}
                <span className="text-sm text-fourth">(до 280 символа)</span>
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={(e) => {
                  // Limit to 280 characters
                  const value = e.target.value.slice(0, 280);
                  const syntheticEvent = {
                    target: {
                      name: "source",
                      value: value,
                    },
                  };
                  handleChange(syntheticEvent);
                }}
                maxLength={280}
                className="mt-1 block w-full rounded-md border text-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <div className="mt-1 text-right text-sm text-fourth">
                {formData.source.length}/280 символа
              </div>
            </div>
            {error && (
              <div
                className={`mb-4 rounded-md p-4 ${
                  error.includes("Вече съществува регистарция")
                    ? "border border-amber-200 bg-amber-50 text-amber-700"
                    : "border border-red-200 bg-red-50 text-red-700"
                }`}
                dangerouslySetInnerHTML={{ __html: error }}
              />
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`rounded-3xl bg-third px-6 py-2 font-rocaTwoBold text-2xl font-black text-fourth transition-all duration-500 ease-in-out hover:bg-transparent hover:text-fourth/30 ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-primary border-b-transparent"></div>
                    ЗАПИСВАНЕ...
                  </div>
                ) : (
                  "ЗАПИШИ МЕ!"
                )}
              </button>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/program")}
                className="rounded-3xl bg-secondary px-3 py-1 font-rocaTwoBold text-base font-bold text-fourth transition-colors hover:bg-secondary"
              >
                {"<- избери друго"}
              </button>
            </div>
          </form>
        </>
      )}
      </div>
    </div>,
    document.body,
    )
  );
};

export default SubscribeAndPay;
