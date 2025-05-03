import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { differenceInHours } from "date-fns";

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
    name: "",
    phone: "",
    participation: "",
    topics: "",
    role: "",
    customRole: "",
    source: "",
  });

  const currentDate = new Date();
  const priceOneTime = () => {
    let difference = differenceInHours(eventDateLocaleString, currentDate);
    if (difference > 49) {
      //two days and one hour
      return (
        <>
          <span className="line-through">30 лв.</span>
          <span className="font-bold"> 27 лв. ранно записване!</span>
        </>
      );
    } else {
      return "30 лв.";
    }
  };

  const handlePrice = () => {
    let difference = differenceInHours(eventDateLocaleString, currentDate);
    if (difference > 49) {
      // two days and one hour
      return "Еднократно Намалено 27 лв.";
    } else {
      return "Еднократно 30 лв.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Sending form data:", formData);
      const response = await fetch(
        "http://192.168.0.142:5174/api/submit-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      // Check if the response indicates an error
      if (!response.ok) {
        // Server returned an error status code
        console.error("Server returned an error:", data);
        setError(data.message || "An error occurred during form submission");
        return; // Stop processing - don't navigate away
      }

      console.log("Form submitted successfully:", data);

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

    // For the role field, clear the customRole when switching to non-custom options
    if (name === "role" && value !== "Друго") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        customRole: "", // Reset custom role when selecting other options
      }));
    } else if (name === "customRole") {
      setFormData((prev) => ({
        ...prev,
        customRole: value,
        role: "Друго", // Ensure role is set to "Друго" when typing in custom field
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="subscribe-and-pay-container z-50 m-auto mb-14 h-[calc(100dvh-100px)] w-11/12 overflow-y-auto rounded-xl bg-white p-8 shadow-lg">
      <h2 className="text-center text-3xl font-bold">Записване за</h2>
      <h1 className="EventSummary">
        <p className="EventName py-2 text-center font-hitchHike text-6xl text-moetoRazhdaneDarkGreen">
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
        className="space-y-4 text-xl font-normal text-gray-700" // Changed from text-lg
      >
        <div>
          <label className="block text-xl font-medium text-gray-700">
            Име и фамилия <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 text-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500" // Added text-xl, removed sm:text-sm
          />
        </div>
        <div>
          <label className="block text-xl font-medium text-gray-700">
            E-Mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-xl font-medium text-gray-700">
            Телефон <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              // Filter input to only allow numbers, plus sign, spaces, parentheses and hyphens
              const filtered = e.target.value.replace(/[^0-9+\s()\-]/g, "");
              // Create a synthetic event with the filtered value
              const syntheticEvent = {
                target: {
                  name: "phone",
                  value: filtered,
                },
              };
              handleChange(syntheticEvent);
            }}
            pattern="^(\+)?[0-9\s()\-]+"
            placeholder="+359 888 123456"
            title="Въведете валиден телефонен номер"
            required
            className="mt-1 block w-full rounded-md border-gray-300 text-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xl font-medium text-gray-700">
            Форма на участие <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            {/* One-time participation option */}
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="participation"
                value={handlePrice()}
                checked={formData.participation === handlePrice()}
                onChange={handleChange}
                required
                className="form-radio"
              />
              <span className="ml-2 text-xl">
                Еднократно участие - {priceOneTime()}
              </span>
            </label>
            <br />

            {/* Membership option */}
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="participation"
                value="Абонамент"
                checked={formData.participation === "Абонамент"}
                onChange={handleChange}
                required
                className="form-radio"
              />
              <span className="ml-2 text-xl">Членство в общността - 85 лв</span>
            </label>
            <br />
          </div>
        </div>

        <div>
          <label className="block text-xl font-medium text-gray-700">
            Аз съм:
          </label>
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="Бременна"
                checked={formData.role === "Бременна"}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2 text-xl">бременна</span>
            </label>
            <br />
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="Родила"
                checked={formData.role === "Родила"}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2 text-xl">вече родила</span>
            </label>
            <br />
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="role"
                value="Друго"
                checked={formData.role === "Друго"}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2 text-xl">друго:</span>
            </label>

            {/* Conditional input field that appears when "Друго" is selected */}
            {formData.role === "Друго" && (
              <div className="ml-6 mt-2">
                <input
                  type="text"
                  name="customRole"
                  value={formData.customRole}
                  onChange={handleChange}
                  placeholder="Моля, уточнете..."
                  className="block w-full rounded-md border-gray-300 text-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <label className="block text-xl font-medium text-gray-700">
              Имам деца на възраст:
            </label>
            <input
              type="text"
              name="topics"
              value={formData.topics}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xl font-medium text-gray-700">
            От къде научи за &quot;За моето раждане&quot;?
          </label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
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
            className={`rounded-3xl bg-moetoRazhdaneYellow px-6 py-2 font-playfairDisplaySc text-2xl font-black text-black transition-all duration-500 ease-in-out hover:bg-transparent hover:text-black/30 ${
              isSubmitting ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {isSubmitting ? "Записване..." : "Запиши ме!"}
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
