import React from "react";
import { Link } from "react-router-dom";
import SocialLinks from "./SocialLinks";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-16 bg-fourth py-12 pb-24 text-white shadow-2xl">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-magnoliaScript text-lg font-semibold text-third">
              Прегърната
            </h3>
            <p className="text-sm text-white/80">
              Общност, създадена от и за майки. Място, в което на фокус е жената
              – приета, чута и подкрепена във всеки етап на своето майчинство.
            </p>
            <SocialLinks />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Бързи връзки</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/events"
                className="text-sm text-white/80 transition-colors hover:text-third"
              >
                Събития
              </Link>
              <Link
                to="/event-types"
                className="text-sm text-white/80 transition-colors hover:text-third"
              >
                Видове събития
              </Link>
              <Link
                to="/about"
                className="text-sm text-white/80 transition-colors hover:text-third"
              >
                За нас
              </Link>
              <Link
                to="/partners"
                className="text-sm text-white/80 transition-colors hover:text-third"
              >
                Партньори
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Правна информация</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/privacy-policy"
                className="text-sm text-white/80 transition-colors hover:text-third"
              >
                Политика за поверителност
              </Link>
              <Link
                to="/terms-of-service"
                className="text-sm text-white/80 transition-colors hover:text-third"
              >
                Общи условия
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Контакти</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p>
                <strong>Email:</strong>
                <br />
                embraced.mothersclub@gmail.com
              </p>


            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-white/70">
              © {new Date().getFullYear()} Прегърната. Всички права запазени.
            </div>

            {/* Additional legal links in bottom */}
            <div className="flex flex-wrap gap-4 text-xs text-white/70">
              <Link
                to="/privacy-policy"
                className="transition-colors hover:text-third"
              >
                Поверителност
              </Link>
              <Link
                to="/terms-of-service"
                className="transition-colors hover:text-third"
              >
                Условия
              </Link>

            </div>
          </div>


        </div>
      </div>
    </footer>
  );
};

export default Footer;
