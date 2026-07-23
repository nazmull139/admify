import React from 'react';
import { CgProfile } from "react-icons/cg";
import { CiTrophy } from "react-icons/ci";
import { FaPaperPlane } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { TbTargetArrow } from "react-icons/tb";

const HowWorks = () => {
  const works = [
    {
      id: 1,
      icon: <CgProfile className="text-2xl text-indigo-600" />,
      title: "Create Profile",
      description: "Signup and create your academic profile.",
      bgColor: "bg-indigo-50"
    },
    {
      id: 2,
      icon: <TbTargetArrow className="text-2xl text-emerald-600" />,
      title: "Get Matched",
      description: "Our AI finds the best universities for you.",
      bgColor: "bg-emerald-50"
    },
    {
      id: 3,
      icon: <FaPaperPlane className="text-2xl text-amber-600" />,
      title: "Apply Smart",
      description: "Apply to your dream universities with ease.",
      bgColor: "bg-amber-50"
    },
    {
      id: 4,
      icon: <LuNotepadText className="text-2xl text-rose-600" />,
      title: "Track Progress",
      description: "Track application and get real-time updates.",
      bgColor: "bg-rose-50"
    },
    {
      id: 5, // ডুপ্লিকেট id ঠিক করা হয়েছে
      icon: <CiTrophy className="text-2xl text-purple-600" />,
      title: "Achieve Dream",
      description: "Receive offers and study abroad!",
      bgColor: "bg-purple-50"
    }
  ];

  // নিচের সংখ্যা বা স্ট্যাটসের ডাটা অ্যারে
  const stats = [
    { id: 1, value: "12.5k+", label: "Universities" },
    { id: 2, value: "45k+", label: "Students Guided" },
    { id: 3, value: "98.6%", label: "Success Rate" },
    { id: 4, value: "20+", label: "Countries" }
  ];

  return (
    <div className='bg-white py-20 px-6 md:px-16 max-w-7xl mx-auto space-y-24'>
      
      {/* ১. "How It Works" সেকশনের মেইন হেডার */}
      <div className='text-center max-w-xl mx-auto space-y-3'>
        <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900'>
          How It <span className='text-indigo-600'>Works</span>
        </h2>
        <p className='text-gray-500'>
          Your seamless journey from local screening to international university enrollment in 5 simple steps.
        </p>
      </div>

      {/* ২. ৫টি স্টেপের প্রসেস গ্রিড */}
      {/* ডেক্সটপে ৫টি কলামে সুন্দরভাবে দেখাবে */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative'>
        {works.map((step, index) => (
          <div key={step.id} className='flex flex-col items-center text-center space-y-4 group relative'>
            
            {/* আইকন কন্টেইনার */}
            <div className={`w-14 h-14 ${step.bgColor} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
              {step.icon}
            </div>

            {/* টেক্সট কন্টেন্ট */}
            <div className='space-y-1'>
              <h3 className='text-lg font-bold text-gray-900'>
                {index + 1}. {step.title}
              </h3>
              <p className='text-gray-500 text-sm leading-relaxed px-2'>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ৩. স্ট্যাটস কাউন্টার সেকশন (Stats Section) */}
      <div className='bg-indigo-600 rounded-3xl p-8 md:p-12 shadow-xl shadow-indigo-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white'>
        {stats.map((stat) => (
          <div key={stat.id} className='space-y-1 border-r last:border-0 border-indigo-500/40 last:border-none'>
            <h2 className='text-3xl md:text-4xl font-black tracking-tight'>
              {stat.value}
            </h2>
            <p className='text-indigo-100 text-sm md:text-base font-medium opacity-90'>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HowWorks;