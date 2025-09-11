import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative z-10 mt-16 bg-gray-900 py-12 pb-24 text-white shadow-2xl">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-magnoliaScript text-lg font-semibold text-moetoRazhdaneYellow">
              Прегърната
            </h3>
            <p className="text-sm text-gray-300">
              Общност, създадена от и за майки. Място, в което на фокус е жената
              – приета, чута и подкрепена във всеки етап на своето майчинство.
            </p>
            <div className="flex space-x-4">
              {/* Social media links can be added here */}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Бързи връзки</h4>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/program"
                className="text-sm text-gray-300 transition-colors hover:text-moetoRazhdaneYellow"
              >
                Програма
              </Link>
              <Link
                to="/events"
                className="text-sm text-gray-300 transition-colors hover:text-moetoRazhdaneYellow"
              >
                Събития
              </Link>
              <Link
                to="/about"
                className="text-sm text-gray-300 transition-colors hover:text-moetoRazhdaneYellow"
              >
                За нас
              </Link>
              <Link
                to="/team"
                className="text-sm text-gray-300 transition-colors hover:text-moetoRazhdaneYellow"
              >
                Екип
              </Link>
              <Link
                to="/partners"
                className="text-sm text-gray-300 transition-colors hover:text-moetoRazhdaneYellow"
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
                className="text-sm text-gray-300 transition-colors hover:text-moetoRazhdaneYellow"
              >
                Политика за поверителност
              </Link>
              <Link
                to="/terms-of-service"
                className="text-sm text-gray-300 transition-colors hover:text-moetoRazhdaneYellow"
              >
                Общи условия
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Контакти</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <strong>Email:</strong>
                <br />
                embraced.mothersclub@gmail.com
              </p>
              <p>
                <strong>Телефон:</strong>
                <br />
                +359 XXX XXX XXX
              </p>
              <p>
                <strong>Работно време:</strong>
                <br />
                Пон-Пет: 09:00-18:00
                <br />
                Съб: 10:00-16:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Прегърната. Всички права запазени.
            </div>

            {/* Additional legal links in bottom */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <Link
                to="/privacy-policy"
                className="transition-colors hover:text-moetoRazhdaneYellow"
              >
                Поверителност
              </Link>
              <Link
                to="/terms-of-service"
                className="transition-colors hover:text-moetoRazhdaneYellow"
              >
                Условия
              </Link>
              <Link
                to="/cookie-policy"
                className="transition-colors hover:text-moetoRazhdaneYellow"
              >
                Бисквитки
              </Link>
            </div>
          </div>

          {/* GDPR/Legal Notice */}
          <div className="mt-4 text-center text-xs text-gray-500 md:text-left">
            <p>
              Този сайт използва бисквитки за подобряване на потребителското
              изживяване. Личните данни се обработват в съответствие с GDPR и
              българското законодателство.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
