import PropTypes from "prop-types";
import { useState, useEffect } from "react";
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

const SubscribeAndPay = ({ onClose }) => {
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
  } = location.state || {};

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showParticipantInfoPopup, setShowParticipantInfoPopup] =
    useState(false);

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
      return "bg-moetoRazhdaneLightGreen text-black"; // Sofia events - light green
    }
    // Check for Plovdiv (default for subscription events)
    else {
      return "bg-moetoRazhdaneDarkGreen text-white"; // Plovdiv events - dark green
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
    let basePrice = difference < 72 ? 40 : 35;
    let memberPrice = Math.max(20, basePrice - 10);
    const count = formData.participantCount;

    // Calculate member pricing: discount for 1 person + regular price for additional participants
    const memberTotalPrice = memberPrice + basePrice * (count - 1);
    const nonMemberTotalPrice = basePrice * count;

    // Calculate hours until price increases (if applicable)
    const hoursUntilIncrease = Math.max(0, difference - 72);
    const daysUntilIncrease = Math.ceil(hoursUntilIncrease / 24);
    const willPriceIncrease = difference > 72;

    return (
      <div className="space-y-2">
        {/* Price increase warning - only show if price will increase */}
        {willPriceIncrease && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
            <p className="text-base text-gray-600">
              💡Таксата ще се увеличи с 5 лв. след {daysUntilIncrease}{" "}
              {daysUntilIncrease === 1 ? "ден" : "дни"} (72 часа преди
              събитието)
            </p>
          </div>
        )}

        <div className="space-y-1">
          <div className="font-bold text-moetoRazhdanePurple">
            {count === 1
              ? `Редовна такса: ${nonMemberTotalPrice} лв.`
              : `Редовна такса: ${nonMemberTotalPrice} лв. (${basePrice} лв. x ${count})`}
            {willPriceIncrease && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                (по-късно: {basePrice + 5} лв.)
              </span>
            )}
          </div>
          <div className="font-bold text-moetoRazhdaneWhite">
            {count === 1
              ? `С отстъпка за членове на "Прегърната": ${memberTotalPrice} лв.`
              : `С отстъпка за членове на "Прегърната": ${memberTotalPrice} лв. (${memberPrice} лв. + ${basePrice} лв. x ${count - 1})`}
            {willPriceIncrease && (
              <span className="ml-2 text-xs font-normal text-gray-500">
                (по-късно: {Math.max(20, basePrice + 5 - 10)} лв.)
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-moetoRazhdaneWhite">
          * Валидната за теб (според членството) крайна сума ще бъде изчислена в
          потвърдителния имейл.
        </div>
      </div>
    );
  };

  const handlePrice = () => {
    let difference = differenceInHours(getEventDateTime(), currentDate);
    let basePrice = difference < 72 ? 40 : 35;
    let memberPrice = Math.max(20, basePrice - 10);
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

    let basePrice = difference < 72 ? 40 : 35;
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
    <div className="subscribe-and-pay-container z-50 m-auto mb-16 max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg sm:mb-24">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner
            size="lg"
            color="green"
            text="Зареждане на събитие..."
          />
          <p className="mt-4 text-center text-moetoRazhdaneWhite">
            Моля изчакайте, докато зареждаме детайлите за събитието...
          </p>
        </div>
      ) : (
        <>
          <h2 className="text-center text-2xl font-bold">Записване за</h2>
          <h1 className="EventSummary">
            <p className="EventName py-2 text-center font-magnoliaScript text-3xl text-moetoRazhdaneDarkGreen">
              {eventSummary}
            </p>

            {/* Secondary Title - First quoted sentence from description */}
            {getFirstQuotedSentence(eventDescription) && (
              <div className="mt-1 flex w-full justify-center">
                <div className="px-3 text-center text-base font-light italic leading-relaxed text-moetoRazhdaneWhite">
                  "{getFirstQuotedSentence(eventDescription)}"
                </div>
              </div>
            )}

            {/* Event Date, Time and Location - styled like MyBirthCalendar */}
            <div className="mt-4 space-y-0 text-moetoRazhdaneWhite">
              {/* Date */}
              <div className="flex items-center gap-2 border-t pt-1">
                <FaCalendarAlt className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
                <div className="EventDescriptionDate">{eventDate}</div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 pb-1">
                <FaClock className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
                <div className="EventDescriptionTime">
                  {eventTime}
                  <span className="ml-2 text-sm font-medium text-moetoRazhdaneWhite/70">
                    (България / EEST)
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 border-b pb-1">
                {/* Use different icons for online vs physical events */}
                {/^https?:\/\/.+/i.test(eventLocation) ? (
                  <FaDesktop className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
                ) : (
                  <FaMapMarkerAlt className="h-4 w-4 text-moetoRazhdaneWhite opacity-75" />
                )}
                <div className="EventDescriptionLocation text-left">
                  {/* Check if location is a URL, show "онлайн събитие", otherwise make it a Google Maps link */}
                  {/^https?:\/\/.+/i.test(eventLocation) ? (
                    <span className="text-moetoRazhdaneWhite">
                      онлайн събитие в Прегърната
                    </span>
                  ) : (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-moetoRazhdaneWhite underline transition-colors duration-200 hover:text-moetoRazhdanePurple"
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
            <button
              type="button"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className={`event-description mb-6 mt-4 w-full overflow-hidden rounded-lg text-left transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${getEventTypeStyle()}`}
            >
              <div className="p-4">
                <h3 className="text-center text-lg font-bold">
                  {isDescriptionExpanded
                    ? "Описание"
                    : "Виж повече за събитето..."}
                </h3>
                {isDescriptionExpanded && (
                  <div
                    className="text-left"
                    dangerouslySetInnerHTML={{ __html: eventDescription }}
                  />
                )}
              </div>
            </button>
          )}
          <form
            onSubmit={handleSubmit}
            className="space-y-3 text-4xl font-normal text-gray-700"
          >
            {/* Email field - always show first */}
            <div>
              <label className="block text-xl font-medium text-gray-700">
                E-Mail <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border text-base shadow-sm focus:border-moetoRazhdaneDarkGreen focus:ring-moetoRazhdaneDarkGreen"
                />
              </div>
            </div>

            {/* First participant name field - separate and required */}
            <div>
              <label className="block text-xl font-medium text-gray-700">
                Име и фамилия<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="participantName_0"
                value={formData.participantNames[0] || ""}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border text-base shadow-sm focus:border-moetoRazhdaneDarkGreen focus:ring-moetoRazhdaneDarkGreen"
              />
            </div>

            <div>
              <label className="block text-xl font-medium text-gray-700">
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
                className="mt-1 block w-full rounded-md border text-base shadow-sm focus:border-moetoRazhdaneDarkGreen focus:ring-moetoRazhdaneDarkGreen"
              />
            </div>

            <div>
              <div className="mt-2 space-y-4">
                {/* Pricing display */}
                <div className="rounded-md border border-gray-100 bg-gray-50 p-3">
                  <span className="text-base text-gray-700">
                    {priceOneTime()}
                  </span>
                </div>

                {/* Simple notification popup - appears only after adding first additional participant */}
                {showParticipantInfoPopup && (
                  <div className="rounded-lg border-l-4 border-moetoRazhdaneDarkGreen bg-moetoRazhdaneLightGreen p-4 shadow-md">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-moetoRazhdaneDarkGreen"
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
                        <div className="text-sm font-medium text-moetoRazhdaneWhite">
                          От тук можеш да запишеш и допълнителни участници (ако
                          решиш да доведеш приятелка), но само първият участник
                          може да бъде таксуван като член.
                        </div>
                      </div>
                      <div className="ml-auto pl-3">
                        <button
                          type="button"
                          className="inline-flex rounded-md bg-moetoRazhdaneLightGreen text-moetoRazhdaneWhite hover:text-moetoRazhdaneDarkGreen focus:outline-none focus:ring-2 focus:ring-moetoRazhdaneDarkGreen focus:ring-offset-2 focus:ring-offset-moetoRazhdaneLightGreen"
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
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-moetoRazhdaneDarkGreen px-6 py-3 text-base font-bold text-white transition-colors duration-200 hover:bg-opacity-90"
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
                      className="flex rounded-full bg-white bg-opacity-20 p-1 transition-colors duration-200 hover:bg-opacity-30"
                      title="Информация за допълнителни участници"
                    >
                      <svg
                        className="h-4 w-4 text-white"
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
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-xl font-medium text-white transition-colors duration-200 hover:bg-red-700"
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
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                          >
                            <label className="mb-2 block text-base font-medium text-gray-700">
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
                              className="block w-full rounded-md border-gray-100 p-3 text-base shadow-sm focus:border-moetoRazhdaneDarkGreen focus:ring-moetoRazhdaneDarkGreen"
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
              <label className="block text-xl font-medium text-gray-700">
                От къде научи за &quot;Прегърната&quot;?{" "}
                <span className="text-sm text-gray-500">(до 280 символа)</span>
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
              <div className="mt-1 text-right text-sm text-gray-500">
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
                className={`rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-rocaTwoBold text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30 ${
                  isSubmitting ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-b-transparent"></div>
                    ЗАПИСВАНЕ...
                  </div>
                ) : (
                  "ЗАПИШИ МЕ!"
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

SubscribeAndPay.propTypes = {
  onClose: PropTypes.func,
};

SubscribeAndPay.defaultProps = {
  onClose: () => {}, // Default empty function if not provided
};
export default SubscribeAndPay;
