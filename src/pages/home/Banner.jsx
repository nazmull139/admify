import React from "react";
import { FaArrowRight, FaStar } from "react-icons/fa";
import bannerImage from "../../assets/bannerImage.png";

const Banner = () => {
  return (
    <div className="bg-[#f4f3fb] min-h-[80vh] flex flex-col md:flex-row justify-between items-center px-6 md:px-30 py-16 gap-12">
      {/* Left: Text Content */}
      <div className="flex-1 space-y-6 max-w-xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <FaStar className="text-amber-500 text-xs" />
          <span>AI-Powered Study Abroad Platform</span>
        </div>

        {/* Headings */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Your AI-Powered{" "}
            <span className="text-indigo-600">Study Abroad</span> Companion
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Get personalized university recommendations, AI SOP & LOR, and
            expert guidance — all in one smart platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition duration-200 shadow-md shadow-indigo-100">
            Get started free <FaArrowRight className="text-sm" />
          </button>
          <button className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl transition duration-200">
            Explore Universities
          </button>
        </div>

        {/* Social Proof / Overlapping Avatars */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200/60">
          {/* Overlapping Rounded Avatars */}
          <div className="flex -space-x-3 overflow-hidden">
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
              alt="Student 1"
            />
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="Student 2"
            />
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
              alt="Student 3"
            />
            <img
              className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
              alt="Student 4"
            />
          </div>

          {/* Review Text */}
          <div className="text-sm">
            <div className="flex text-amber-500 gap-0.5 mb-0.5">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar className="opacity-80" />
            </div>
            <p className="text-gray-600 font-medium">
              <span className="text-gray-900 font-bold">4.8/5</span> from 2,500+
              students
            </p>
          </div>
        </div>
      </div>

      {/* Right: Image Section */}
      <div className="flex-1 w-full flex justify-center items-center">
        <img
          src={bannerImage}
          alt="Banner Illustration"
          className="w-full md:w-[90%] h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Banner;
