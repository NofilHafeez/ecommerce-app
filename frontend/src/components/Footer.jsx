import React from "react";
import { FaInstagram } from "react-icons/fa";
import { TiSocialFacebookCircular } from "react-icons/ti";
import { AiOutlineYoutube } from "react-icons/ai";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-black text-white w-full  py-8 px-5">
      <div className="container mx-auto flex flex-wrap justify-between items-start md:items-center">
        {/* ✅ Logo Section */}
        <div className="w-full md:w-auto text-center md:text-left mb-6 md:mb-0">
          <h1 className="font-bold text-2xl">BCKWRD</h1>
        </div>

        {/* ✅ Links Section */}
        <div className="flex flex-wrap gap-10 md:gap-20 text-center md:text-left w-full md:w-auto justify-center md:justify-start">
          {/* Men's Categories */}
          <div>
            <h1 className="font-medium mb-3">MEN'S Categories</h1>
            <h4 className="text-gray-300">Shoes</h4>
            <h4 className="text-gray-300">Jackets</h4>
            <h4 className="text-gray-300">Shirts</h4>
          </div>

          {/* Contact */}
          <div>
            <h1 className="font-medium mb-3">CONTACT</h1>
            <h4 className="text-gray-300">Belgium, Germany</h4>
            <h4 className="text-gray-300">Washington DC</h4>
            <h4 className="text-gray-300">20042</h4>
          </div>

          {/* Social Media */}
          <div>
            <h1 className="font-medium mb-3">Social Media</h1>
            <div className="text-2xl flex gap-4 justify-center md:justify-start">
              <FaInstagram className="cursor-pointer hover:text-gray-400" />
              <TiSocialFacebookCircular className="cursor-pointer hover:text-gray-400" />
              <AiOutlineYoutube className="cursor-pointer hover:text-gray-400" />
              <FaXTwitter className="cursor-pointer hover:text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
