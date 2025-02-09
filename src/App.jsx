import Background from "./Background";
import TitleAndMenu from "./TitleAndMenu";
import Events from "./Events";
import About from "./About";
import SubscribeAndPay from "./SubscribeAndPay";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // Get the base path from Vite's environment
  const basePath =
    import.meta.env.MODE === "production" ? "/zamoetorazhdane" : "";

  return (
    <>
      <div className="flex min-h-screen flex-col justify-center text-center">
        <Background />
        <Router basename={basePath}>
          <Routes>
            <Route path="/" element={<TitleAndMenu />} />
            <Route path="/about" element={<About />} />
            <Route path="/program" element={<Events />} />
            <Route
              path="/subscribe-and-pay/:eventId"
              element={<SubscribeAndPay />}
            />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
