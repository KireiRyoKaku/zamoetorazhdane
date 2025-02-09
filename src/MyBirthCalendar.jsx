import { useState, useEffect } from "react";
import SubscribeAndPay from "./SubscribeAndPay";
import { useNavigate } from "react-router-dom";

const MyBirthCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [interactableDates, setInteractableDates] = useState([]);
  const [interactableDatesSpecial, setInteractableDatesSpecial] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [events, setEvents] = useState([]);
  const [ShowSubscribeAndPay, setShowSubscribeAndPay] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (prev.getMonth() === 0) {
        newDate.setMonth(11);
        newDate.setFullYear(prev.getFullYear() - 1);
      } else {
        newDate.setMonth(prev.getMonth() - 1);
      }
      console.log("Current date:", newDate);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (prev.getMonth() === 11) {
        newDate.setMonth(0);
        newDate.setFullYear(prev.getFullYear() + 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      console.log("Current date:", newDate);
      return newDate;
    });
  };

  const handleClickSubscribeAndPay = (event) => {
    navigate(`/subscribe-and-pay/${event.cID}`, {
      state: {
        eventSummary: event.summary,
        eventDate: event.dateOfEvent,
        eventID: event.ID,
        eventStart: event.start,
        eventEnd: event.end,
        eventLocation: event.location,
        eventDescription: event.description,
      },
    });

    setShowSubscribeAndPay(true);
    setTimeout(() => setIsBlurred(false), 10); // Short delay to ensure the modal is rendered
  };

  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        const response = await fetch(`${apiUrl}/events`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const events = await response.json();
        // console.log("Server response Events:", events);

        const dates = events.map((event) => event.dayOfEvent);
        setInteractableDates(dates);
        // console.log("Interactable dates:", interactableDates);

        const specialDatesArray = events.filter(
          (event) => event.type === "Special",
        );
        const specialDates = specialDatesArray.map((event) => event.dayOfEvent);
        // console.log("Special dates:", specialDates);
        setInteractableDatesSpecial(specialDates);

        // Update the events state with the fetched events data
        setEvents(events);
      } catch (error) {
        console.error("Error fetching event dates:", error);
      }
    };

    fetchEventDates();
  }, [interactableDates, interactableDatesSpecial]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 200); // 500ms delay before starting the animation

    return () => clearTimeout(timer);
  }, []);

  const handleDayClick = (day) => {
    console.log("Clicked day:", day);
    if (interactableDates.includes(day)) {
      const event = events.find((event) => event.dayOfEvent === day);
      if (event) {
        +document
          .querySelector(`.EventDescription[data-id="${event.ID}"]`)
          .classList.toggle("hidden");
      } else {
        console.error("Event not found for day:", day);
      }
    }
  };

  const handleEventBoxClick = (e) => {
    const eventBox = e.currentTarget;
    const eventDescription = eventBox.querySelector(".EventDescription");
    if (eventDescription) {
      eventDescription.classList.toggle("hidden");
    }
  };

  function createCalendar(year, month) {
    const myCalendar = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to start from Monday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysOfWeek = ["Пон", "Втр", "Сря", "Чет", "Пет", "Съб", "Нед"];
    // Add days of week as the first row
    myCalendar.push(daysOfWeek.map((day) => ({ day, isHeader: true })));

    // Filter dates for current month
    const currentMonthEvents = events.filter((event) => {
      const [, monthStr] = event.dateOfEvent.split("."); // Skip first element
      const eventMonth = parseInt(monthStr) - 1; // Convert to 0-based month
      return eventMonth === month;
    });

    // Get arrays of dates for current month only
    const currentMonthInteractableDates = currentMonthEvents.map(
      (event) => event.dayOfEvent,
    );
    const currentMonthSpecialDates = currentMonthEvents
      .filter((event) => event.type === "Special")
      .map((event) => event.dayOfEvent);

    let dayOfMonth = 1;

    for (let i = 0; i < 6; i++) {
      myCalendar.push([]);
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayIndex) {
          myCalendar[i + 1].push({ day: "", isHighlighted: false });
        } else if (dayOfMonth <= daysInMonth) {
          const isHighlighted =
            currentMonthInteractableDates.includes(dayOfMonth);
          const isSpecial = currentMonthSpecialDates.includes(dayOfMonth);

          myCalendar[i + 1].push({ day: dayOfMonth, isHighlighted, isSpecial });
          dayOfMonth++;
        } else {
          myCalendar[i + 1].push({ day: "", isHighlighted: false });
        }
      }
    }

    return myCalendar;
  }

  const createEventList = () => {
    // Filter events for current month
    const currentMonthEvents = events.filter((event) => {
      const eventDate = event.dateOfEvent.split(".");
      const eventMonth = parseInt(eventDate[1]) - 1; // Convert to 0-based month
      return eventMonth === currentDate.getMonth();
    });

    return currentMonthEvents.map((event, index) => {
      let eventCircleClass =
        "EventCircle flex h-10 w-10 items-center justify-center rounded-full font-playfairDisplay text-xl text-white";
      if (event.type === "Special") {
        eventCircleClass += " bg-moetoRazhdanePurple"; // Add the background color class
      } else {
        eventCircleClass += " bg-moetoRazhdaneDarkGreen"; // Default background color class
      }
      return (
        <div
          key={index}
          className={`event-box id=${event.ID} mb-4 flex w-full items-center rounded bg-white p-4 ring-1 ring-moetoRazhdaneDarkGreen drop-shadow-2xl transition-all duration-500 ease-out ${
            showAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
          onClick={handleEventBoxClick}
        >
          <div className="flex w-full items-center">
            <div className="EventDay mr-4 flex items-center justify-center">
              <span className={eventCircleClass}>
                <div className="mb-2">{event.dayOfEvent}</div>
              </span>
            </div>
            <div className="EventSummary flex-1 font-hitchHike text-4xl text-moetoRazhdaneDarkGreen">
              {event.summary}
              <div
                className="EventDescription hidden flex-1 items-center bg-white p-4 font-montserrat text-sm text-moetoRazhdaneDarkGreen"
                data-id={event.ID}
              >
                <div className="EventDescriptionText box-border max-w-full grid-rows-3">
                  {event.description}
                </div>
                <p>
                  <div className="EventDescriptionLocation relative">
                    {event.location}
                  </div>
                </p>
                <p>
                  <div className="EventDescriptionTime">
                    {event.timeStart} - {event.timeEnd}
                  </div>
                </p>
                <p>
                  <div className="EventDescriptionDate">
                    {event.dateOfEvent}
                  </div>
                </p>
                <br />
                <div>
                  <button
                    className="enlist-button max-w-full flex-1"
                    onClick={() => handleClickSubscribeAndPay(event)}
                  >
                    <p>
                      <br />
                      Запиши се
                      <br /> сега!
                    </p>
                    <br />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const myCalendar = createCalendar(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    events,
  );

  const monthName = currentDate.toLocaleString("bg-BG", { month: "long" });
  const year = currentDate.getFullYear();
  return (
    <div className="flex flex-col gap-1 lg:flex-row">
      <div className="calendar-container w-full flex-1 font-playfairDisplay">
        <div className="calendar-header flex-1 flex-col items-center justify-center font-makLight">
          <div className="calender-navigation flex items-center justify-center gap-4 p-3 text-center text-6xl">
            <div>
              <button onClick={handlePrevMonth}>&lt;</button>
            </div>
            <div className="calender-year-month relative flex flex-col items-center justify-center">
              <div className="calender-year absolute -bottom-12 left-1/2 -z-10 -translate-x-1/2 text-9xl leading-none text-gray-300/50">
                {year}
              </div>
              <div className="calender-month relative z-10 text-5xl font-extrabold text-moetoRazhdanePurple">
                {monthName}
              </div>
            </div>
            <div>
              <button onClick={handleNextMonth}>&gt;</button>
            </div>
          </div>
          <div className="mb-5 text-center text-xl text-moetoRazhdaneDarkGreen">
            при за моето раждане
            <p className="text-red-600">изберете ден или събитие!</p>
          </div>
        </div>
        <div
          className="myCalendar flex w-full flex-col items-center justify-center"
          style={{
            backgroundImage: "url('/src/assets/pictures/background-logo.png')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <table className="w-full max-w-3xl">
            <tbody>
              {myCalendar.map((week, weekIndex) => (
                <tr key={weekIndex} className="flex justify-center">
                  {week.map((day, dayIndex) => (
                    <td
                      key={dayIndex}
                      className={`calendar-cell flex h-12 w-12 items-center justify-center ${
                        day.isHeader
                          ? "font-hitchHike text-xl font-bold text-moetoRazhdaneDarkGreen"
                          : day.isSpecial
                            ? "special"
                            : day.isHighlighted
                              ? "highlighted"
                              : ""
                      }`}
                      onClick={() => !day.isHeader && handleDayClick(day.day)}
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
      <div className="events-container col-span-2 flex w-full flex-col items-center justify-center">
        <div className="mb-4 text-2xl font-bold text-moetoRazhdaneDarkGreen">
          Събития
        </div>
        {events.length > 0 ? (
          createEventList()
        ) : (
          <div
            className={`event-box mb-4 flex w-full items-center bg-white p-4 ring-1 ring-moetoRazhdaneDarkGreen drop-shadow-2xl transition-all duration-500 ease-out ${
              showAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            onClick={() => handleEventBoxClick()}
          >
            <div className="flex h-full items-center">
              <div className="NoEventDay mr-4 flex items-center justify-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-moetoRazhdaneDarkGreen font-playfairDisplay text-xl text-white">
                  <div className="mb-2">😿</div>
                </span>
              </div>
              <div className="NoEventSummary flex-1 items-center font-hitchHike text-xl text-moetoRazhdaneDarkGreen">
                Няма събития
                <div
                  className={`NoEventDescription hidden flex-1 items-center bg-white p-4 font-hitchHike text-xl text-moetoRazhdaneDarkGreen ring-1 ring-moetoRazhdaneDarkGreen drop-shadow-2xl transition-all`}
                >
                  Няма събития за избрания ден.
                  <br />
                  Проверете отново по-късно.
                </div>
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
            className={`max-w-full rounded bg-slate-50 p-10 font-montserrat transition-all duration-300 ${
              isBlurred ? "scale-95 blur-md" : "scale-100 blur-0"
            }`}
          >
            <SubscribeAndPay onClose={() => setShowSubscribeAndPay(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBirthCalendar;
