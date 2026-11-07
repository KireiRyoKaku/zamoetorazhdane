import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaHeartbeat,
} from "react-icons/fa";

const SocialLinks = () => {
  return (
    <nav aria-label="Социални мрежи и контакти" className="flex gap-5">
      <a
        href="https://www.facebook.com/embraced.mothersclub"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="transform-gpu text-white transition-all duration-300 ease-in-out hover:scale-90 hover:text-third focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-third active:scale-75"
      >
        <FaFacebook className="h-6 w-6" />
      </a>
      <a
        href="https://www.instagram.com/embraced.mothersclub/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="transform-gpu text-white transition-all duration-300 ease-in-out hover:scale-90 hover:text-third focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-third active:scale-75"
      >
        <FaInstagram className="h-6 w-6" />
      </a>
      <a
        href="mailto:contact@zamoetorazhdane.bg"
        aria-label="Изпратете ни имейл"
        className="transform-gpu text-white transition-all duration-300 ease-in-out hover:scale-90 hover:text-third focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-third active:scale-75"
      >
        <FaEnvelope className="h-6 w-6" />
      </a>
    </nav>
  );
};

export default SocialLinks;
