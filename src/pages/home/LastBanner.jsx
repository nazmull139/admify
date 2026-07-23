import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { LuSparkles } from 'react-icons/lu';
const LastBanner = () => {
  return (
    <div className='max-w-7xl mx-auto px-6 md:px-16 my-16'>
      {/* মেইন ব্যানার বক্স */}
      <div className='bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-xl shadow-indigo-100'>
        
        {/* ব্যাকগ্রাউন্ড ডেকোরেশন (হালকা গ্লোয়িং শেপ) */}
        <div className='absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl'></div>
        <div className='absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl'></div>

        {/* কনটেন্ট */}
        <div className='max-w-2xl mx-auto space-y-6 relative z-10 flex flex-col items-center'>
          <div className='bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase inline-flex items-center gap-2 border border-white/10'>
            <LuSparkles className="text-amber-400" /> Admissions Open for 2026
          </div>
          
          <h2 className='text-3xl md:text-5xl font-black leading-tight tracking-tight'>
            Ready to start your <br className='hidden sm:block'/> Study Abroad Journey?
          </h2>
          
          <p className='text-indigo-100/80 text-base md:text-lg max-w-xl font-medium'>
            Join thousands of students who have already unlocked their global potential. Get your personalized roadmap today.
          </p>

          <button className='flex items-center gap-2 bg-white hover:bg-gray-50 text-indigo-700 font-bold px-8 py-4 rounded-xl transition duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform mt-4'>
            Get Started Free <FaArrowRight className="text-sm" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default LastBanner;