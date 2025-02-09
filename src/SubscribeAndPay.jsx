import PropTypes from "prop-types";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SubscribeAndPay = ({ onClose }) => {
  const location = useLocation();
  const { eventSummary = "", eventDate = "" } = location.state || {};
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    onClose(navigate("/program"));
  };

  const [formData, setFormData] = useState({
    event: eventSummary || "",
    eventDate: eventDate || "",
    email: "",
    name: "",
    phone: "",
    participation: "",
    topics: "",
    role: "",
    source: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Sending form data:", formData);
      const response = await fetch("http://192.168.0.63:5174/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Нещо се обърка, майна. Моля, майна, опитайте отново.");
      }

      const data = await response.json();
      console.log("Form submitted successfully:", data);
      handleClose();
    } catch (err) {
      setError(err.message);
      console.error("Error submitting form:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="subscribe-and-pay-container z-50 m-auto bg-white p-8 shadow-lg">
      <h2 className="text-1xl text-center font-bold">Плати и се запиши за</h2>
      <h1 className="EventSummary text-center text-2xl font-bold">
        {eventSummary} на {eventDate}
      </h1>
      <br />
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 font-playfairDisplay">
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
          <label className="block text-sm font-medium text-gray-700">
            Име и фамилия <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Телефон <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Форма на участие <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="participation"
                value="Еднократно"
                checked={formData.participation === "Еднократно"}
                onChange={handleChange}
                required
                className="form-radio"
              />
              <span className="ml-2">Еднократно участие - 30 лв</span>
            </label>
            <br />
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
              <span className="ml-2">Членство в общността - 85 лв</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Теми актуални за мен
          </label>
          <input
            type="text"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Аз съм:
          </label>
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="role"
                value="Бременна"
                checked={formData.role === "Бременна"}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">бременна</span>
            </label>
            <br />
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="role"
                value="Родила"
                checked={formData.role === "Родила"}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span className="ml-2">вече родила</span>
            </label>
          </div>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Записване и Препращане..." : "Плати с myPos"}
          </button>
        </div>
        <div className="flex w-full justify-center">
          <button className="back-button-test" onClick={handleClose}>
            Назад
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
