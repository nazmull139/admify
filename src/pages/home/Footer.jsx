import React from 'react';
import { FaFacebook, FaGlobe, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-400 pt-16 pb-8 px-6 md:px-16 border-t border-gray-800'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12'>
        
        {/* ১ নম্বর কলাম: লোগো এবং বিবরণ */}
        <div className='lg:col-span-2 space-y-4'>
          <div className='flex items-center gap-2 text-white font-black text-xl tracking-wider'>
            <span className='bg-indigo-600 px-2.5 py-1 rounded-lg text-white'>AI</span>
            <span>Study AI</span>
          </div>
          <p className='text-sm text-gray-400 leading-relaxed max-w-sm'>
            Making global education accessible, smart, and stress-free for students worldwide using advanced artificial intelligence.
          </p>
          {/* সোশ্যাল মিডিয়া আইকন */}
          <div className='flex gap-4 pt-2'>
            <a href="#" className='hover:text-white transition-colors'><FaFacebook size={20} /></a>
            <a href="#" className='hover:text-white transition-colors'><FaTwitter size={20} /></a>
            <a href="#" className='hover:text-white transition-colors'><FaLinkedin size={20} /></a>
            <a href="#" className='hover:text-white transition-colors'><FaInstagram size={20} /></a>
          </div>
        </div>

        {/* ২ নম্বর কলাম: প্ল্যাটফর্ম */}
        <div className='space-y-4'>
          <h4 className='text-white font-bold text-sm uppercase tracking-wider'>Platform</h4>
          <ul className='space-y-2 text-sm'>
            <li><a href="#" className='hover:text-white transition-colors'>AI Recommendation</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>SOP & LOR Generator</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>Application Tracker</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>Visa Guidance</a></li>
          </ul>
        </div>

        {/* ৩ নম্বর কলাম: দেশসমূহ */}
        <div className='space-y-4'>
          <h4 className='text-white font-bold text-sm uppercase tracking-wider'>Destinations</h4>
          <ul className='space-y-2 text-sm'>
            <li><a href="#" className='hover:text-white transition-colors'>United Kingdom</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>United States</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>Canada</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>Australia</a></li>
          </ul>
        </div>

        {/* ৪ নম্বর কলাম: সাপোর্ট */}
        <div className='space-y-4'>
          <h4 className='text-white font-bold text-sm uppercase tracking-wider'>Support</h4>
          <ul className='space-y-2 text-sm'>
            <li><a href="#" className='hover:text-white transition-colors'>Contact Us</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>Privacy Policy</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>Terms of Service</a></li>
            <li><a href="#" className='hover:text-white transition-colors'>FAQs</a></li>
          </ul>
        </div>

      </div>

      {/* নিচের কপিরাইট পার্ট */}
      <div className='max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left text-xs text-gray-500 space-y-2 md:space-y-0'>
        <p>© 2026 Study AI Abroad Platform. All rights reserved.</p>
        <p className='flex items-center justify-center gap-1.5 hover:text-gray-400 cursor-pointer'>
          <FaGlobe /> English (US)
        </p>
      </div>
    </footer>
  );
};

export default Footer;