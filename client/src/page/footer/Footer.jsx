import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import ChatBot from "../../chatbot/ChatBot";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-6 mt-8">
      <div className="max-w-screen-xl mx-auto text-center text-gray-200">
        <p>&copy; 2024 Chitkara Connect. All rights reserved.</p>

        {/* Social Media Icons */}
        <div className="mt-4 space-x-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-red-600"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-red-600"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-red-600"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-red-600"
          >
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
