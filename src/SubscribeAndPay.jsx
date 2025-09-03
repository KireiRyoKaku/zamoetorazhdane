import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { differenceInHours } from "date-fns";
import { API_URL } from "../utils/apiConfig.js";

const SubscribeAndPay = ({ onClose }) => {
  const location = useLocation();
  const {
    eventSummary = "",
    eventDate = "",
    eventDateLocaleString = "",
    eventTime = "",
    eventLocation = "",
  } = location.state || {};

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const currentDate = new Date();
  
  // Create proper event datetime by combining eventDateLocaleString and eventTime
  const getEventDateTime = () => {
    if (eventDateLocaleString.includes('T')) {
      // If it's already an ISO string, use it directly
      return new Date(eventDateLocaleString);
    } else {
      // If it's just a date string, combine with time
      const eventDateTime = new Date(eventDateLocaleString);
      if (eventTime) {
        const [hours, minutes] = eventTime.split(':').map(Number);
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
    const memberTotalPrice = memberPrice + (basePrice * (count - 1));
    const nonMemberTotalPrice = basePrice * count;
    
    return (
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="font-bold text-red-600">
        {count === 1 ? 
          `Нормална цена: ${nonMemberTotalPrice} лв.` :
          `Нормална цена: ${nonMemberTotalPrice} лв. (${basePrice} лв. x ${count})`
        }
          </div>
          <div className="font-bold text-green-600">
        {count === 1 ? 
          `Цена за членове: ${memberTotalPrice} лв.` :
          `Цена за членове: ${memberTotalPrice} лв. (${memberPrice} лв. + ${basePrice} лв. x ${count - 1})`
        }
          </div>
        </div>
        <div className="text-sm text-blue-600">
          * Правилната цена ще бъде изчислена в потвърдителния имейл според членството ти. Само първия участник може да бъде таксуван като член.
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
    const memberTotalPrice = memberPrice + (basePrice * (count - 1));
    const nonMemberTotalPrice = basePrice * count;
    
    return `Еднократно: Нечленове ${nonMemberTotalPrice} лв. ${count > 1 ? `(${basePrice} x ${count})` : ''} | Членове ${memberTotalPrice} лв. ${count > 1 ? `(${memberPrice} + ${basePrice} x ${count - 1})` : ''}`;
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
    
    const submissionData = { ...formData, event: eventSummary, eventDate, price: calculatedPrice };
    
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
      let filtered = inputValue.replace(/[^а-яА-Яa-zA-Z\s\-']/g, '');
      
      // Limit to reasonable name length
      if (filtered.length > 50) {
        filtered = filtered.slice(0, 50);
      }
      
      // Prevent multiple consecutive spaces
      filtered = filtered.replace(/\s{2,}/g, ' ');
      
      // Prevent starting with space or hyphen
      filtered = filtered.replace(/^[\s\-]/, '');
      
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
      setFormData((prev) => ({
        ...prev,
        participantCount: prev.participantCount + 1,
      }));
    }
  };

  // Function to remove a participant
  const removeParticipant = () => {
    if (formData.participantCount > 1) {
      setFormData((prev) => ({
        ...prev,
        participantCount: prev.participantCount - 1,
        // Clear the name of the removed participant
        participantNames: prev.participantNames.map((name, index) =>
          index === prev.participantCount - 1 ? "" : name
        ),
      }));
    }
  };

  return (
    <div className="subscribe-and-pay-container z-50 m-auto mb-16 max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg sm:mb-24">
      <h2 className="text-center text-4xl font-bold">Записване за</h2>
      <h1 className="EventSummary">
        <p className="EventName py-2 text-center font-magnoliaScript text-5xl text-moetoRazhdaneDarkGreen">
          {eventSummary}
        </p>
        <p className="Date text-center text-3xl font-bold">
          на {eventDate}
          <br />
          от {eventTime}ч.
        </p>
      </h1>
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
              className="mt-1 block w-full rounded-md border-gray-100 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* First participant name field - separate and required */}
        <div>
          <label className="block text-xl font-medium text-gray-700">
            Име и фамилия (Участник 1) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="participantName_0"
            value={formData.participantNames[0] || ""}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-50 text-base shadow-sm focus:border-moetoRazhdaneDarkGreen focus:ring-moetoRazhdaneDarkGreen"
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
                value = value.replace(/[^\d+\s()\-]/g, '');
                
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
              className="mt-1 block w-full rounded-md border-gray-50 text-base shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        
        <div>
          <label className="block text-xl font-medium text-gray-700">
            Запазване на място
          </label>
          <div className="mt-2 space-y-4">
            {/* Pricing display */}
            <div className="rounded-md border border-gray-100 bg-gray-50 p-3">
              <span className="text-base text-gray-700">
                {priceOneTime()}
              </span>
            </div>
            
            {/* Add participant button */}
            {formData.participantCount < 5 && (
              <button
                type="button"
                onClick={addParticipant}
                className="w-full bg-moetoRazhdaneDarkGreen text-white text-base font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>+ добави място</span>
                <span className="text-lg">({formData.participantCount}/5)</span>
              </button>
            )}
            
            {/* Remove participant button (only show if more than 1) */}
            {formData.participantCount > 1 && (
              <button
                type="button"
                onClick={removeParticipant}
                className="w-full bg-red-600 text-white text-xl font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                - премахни място ({formData.participantCount}/5)
              </button>
            )}
            
            {/* Dynamic participant name fields - appear below buttons (additional participants only) */}
            {formData.participantCount > 1 && (
              <div className="space-y-3 mt-4">
                {Array.from({ length: formData.participantCount - 1 }, (_, index) => {
                  const actualIndex = index + 1; // Start from participant 2
                  return (
                    <div key={actualIndex} className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow-sm">
                      <label className="block text-base font-medium text-gray-700 mb-2">
                        Участник {actualIndex + 1} - Име и фамилия
                      </label>
                      <input
                        type="text"
                        name={`participantName_${actualIndex}`}
                        value={formData.participantNames[actualIndex] || ""}
                        onChange={handleChange}
                        required={false} // Additional participants are not required
                        className="block w-full rounded-md border-gray-100 text-base shadow-sm focus:border-moetoRazhdaneDarkGreen focus:ring-moetoRazhdaneDarkGreen p-3"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-xl font-medium text-gray-700">
            От къде научи за &quot;Прегърната&quot;? <span className="text-sm text-gray-500">(до 280 символа)</span>
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
            className="mt-1 block w-full rounded-md border-gray-100 text-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            {isSubmitting ? "ЗАПИСВАНЕ..." : "ЗАПИШИ МЕ!"}
          </button>
        </div>
      </form>
    </div>
  );
};

SubscribeAndPay.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default SubscribeAndPay;
