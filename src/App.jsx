import Program from "./Program";
import About from "./About";
import Events from "./EventsNew";
import Partners from "./Partners";
import Team from "./Team";
import Title from "./Title";
import SubscribeAndPay from "./SubscribeAndPay";
import PopupMenu from "./PopupMenu";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import CookieConsent from "./CookieConsent";

const App = () => {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Title />} />
          <Route path="/about" element={<About />} />
          <Route path="/program" element={<Program />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<Events />} />{" "}
          <Route path="/partners" element={<Partners />} />
          <Route path="/team" element={<Team />} />
          <Route
            path="/subscribe-and-pay/:eventId"
            element={<SubscribeAndPay />}
          />
        </Routes>
        <PopupMenu />
        <CookieConsent />
      </div>
    </Router>
  );
};

export default App;
