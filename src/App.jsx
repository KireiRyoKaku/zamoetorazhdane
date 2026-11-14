import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Events from "./Events";
import About from "./About";
import EventTypes from "./EventsNew";
import Partners from "./Partners";
import KatyaServices from "./KatyaServices";
import AneliaServices from "./AneliaServices";
import Mentoring from "./Mentoring";
import Community from "./Community";
import Title from "./Title";
import SubscribeAndPay from "./SubscribeAndPay";
import PopupMenu from "./PopupMenu";
import Footer from "./components/Footer";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import CookieConsent from "./CookieConsent";
import Test from "./Test";
import { getEvents } from "../utils/events";

const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  const previousPathRef = useRef(pathname);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    const previous = previousPathRef.current;
    previousPathRef.current = pathname;
    const isModal = (path) => path.startsWith("/subscribe-and-pay/");
    if (isModal(pathname) || isModal(previous)) return;
    if (
      pathname === "/" &&
      (state?.scrollTo === "katya-card" || previous === "/katya")
    ) {
      const katyaCard = document.getElementById("katya-card");
      if (katyaCard) {
        katyaCard.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, state]);

  return null;
};

const RouteTransition = ({ children, animate }) => {
  const [isVisible, setIsVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) {
      setIsVisible(true);
      return undefined;
    }

    setIsVisible(false);
    let secondFrame;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setIsVisible(true));
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
    };
  }, [animate]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        animate
          ? isVisible
            ? "scale-100 opacity-100"
            : "scale-[0.98] opacity-0"
          : ""
      }`}
    >
      {children}
    </div>
  );
};

const ProgramRedirect = () => {
  const { search, hash, state } = useLocation();
  return <Navigate to={{ pathname: "/events", search, hash }} state={state} replace />;
};

const Layout = () => {
  const { pathname } = useLocation();
  const isSubscriptionModal = pathname.startsWith("/subscribe-and-pay/");

  useEffect(() => {
    if (pathname === "/") {
      getEvents().catch((error) => {
        console.error("Error preloading events:", error);
      });
    }
  }, [pathname]);

  return (
    <div
      className={`relative flex min-h-screen flex-col ${
        pathname === "/" ? "" : "pt-16 md:pt-20"
      } ${pathname === "/about" ? "bg-white" : ""}`}
    >
      <ScrollToTop />
      <div
        className={`w-full flex-1 ${pathname === "/about" ? "bg-white" : ""}`}
      >
        <RouteTransition
          key={pathname}
          animate={pathname !== "/" && pathname !== "/about"}
        >
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<Title />} />
            <Route path="/about" element={<About />} />
            <Route path="/program" element={<ProgramRedirect />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:eventId" element={<EventTypes />} />
            <Route path="/event-types" element={<EventTypes />} />
            <Route path="/event-types/:eventId" element={<EventTypes />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/katya" element={<KatyaServices />} />
            <Route path="/anelia" element={<AneliaServices />} />
            <Route path="/mentoring" element={<Mentoring />} />
            <Route path="/community" element={<Community />} />
            <Route path="/test" element={<Test />} />
            <Route
              path="/subscribe-and-pay/:eventId"
              element={
                <>
                  <Events />
                  <SubscribeAndPay />
                </>
              }
            />

            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </RouteTransition>
      </div>

      {!isSubscriptionModal && <Footer />}

      {/* Global Components */}
      <PopupMenu />
      <CookieConsent />
    </div>
  );
};

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
