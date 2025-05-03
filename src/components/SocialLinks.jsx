import React from "react";
import { FaFacebook, FaInstagram, FaEnvelope } from "react-icons/fa";

const SocialLinks = () => {
  return (
    <div className="mb-6 flex gap-8">
      <a
        href="https://facebook.com/zamoetorazhdane"
        target="_blank"
        rel="noopener noreferrer"
        className="transform-gpu text-stone-900 transition-all duration-300 ease-in-out hover:scale-90 hover:text-blue-600 active:scale-75"
      >
        <FaFacebook className="h-6 w-6" />
      </a>
      <a
        href="https://instagram.com/zamoetorazhdane"
        target="_blank"
        rel="noopener noreferrer"
        className="transform-gpu text-stone-900 transition-all duration-300 ease-in-out hover:scale-90 hover:text-moetoRazhdanePurple active:scale-75"
      >
        <FaInstagram className="h-6 w-6" />
      </a>
      <a
        href="mailto:contact@zamoetorazhdane.bg"
        className="transform-gpu text-stone-900 transition-all duration-300 ease-in-out hover:scale-90 hover:text-white active:scale-75"
      >
        <FaEnvelope className="h-6 w-6" />
      </a>
    </div>
  );
};

export default SocialLinks;
