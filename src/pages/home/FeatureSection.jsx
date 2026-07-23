import React from 'react';

import { LiaFileSignatureSolid } from "react-icons/lia";
import { LuCompass, LuTrendingUp, LuUniversity } from "react-icons/lu";

const FeatureSection = () => {
 
  const features = [
    {
      id: 1,
      icon: <LuUniversity className="text-2xl text-indigo-600" />,
      title: "AI University Recommendation",
      description: "Find the best universities that perfectly match your academic and financial profile.",
      bgColor: "bg-indigo-50"
    },
    {
      id: 2,
      icon: <LiaFileSignatureSolid  className="text-2xl text-emerald-600" />,
      title: "AI SOP & LOR Generator",
      description: "Generate highly personalized Statement of Purpose and Letters of Recommendation in seconds.",
      bgColor: "bg-emerald-50"
    },
    {
      id: 3,
      icon: <LuTrendingUp className="text-2xl text-amber-600" />,
      title: "Application Tracking",
      description: "Track all your university applications, deadlines, and status updates in one real-time dashboard.",
      bgColor: "bg-amber-50"
    },
    {
      id: 4,
      icon: <LuCompass className="text-2xl text-rose-600" />,
      title: "Visa & Expert Guidance",
      description: "Get end-to-end visa assistance and mock interview preparation from industry experts.",
      bgColor: "bg-rose-50"
    }
  ];

  return (
    <div className='bg-white py-20 px-6 md:px-16 max-w-7xl mx-auto'>
      
      {/* সেকশনের ওপরের মেইন হেডিং */}
      <div className='text-center max-w-2xl mx-auto mb-16 space-y-4'>
        <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900'>
          Everything you need to <span className='text-indigo-600'>Study Abroad</span>
        </h2>
        <p className='text-gray-500 text-base md:text-lg'>
          Our AI-powered tools and expert human insights ensure a seamless journey from shortlisting to enrollment.
        </p>
      </div>

      {/* ২. গ্রিড লেআউট (Grid Layout) */}
      {/* মোবাইলে ১টি, ট্যাবলেটে ২টি এবং ডেক্সটপে ৪টি কলাম দেখাবে */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
        {
          features.map((feature) => (
            <div 
              key={feature.id} 
              className='group bg-white border border-gray-100 hover:border-indigo-100 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
            >
              {/* আইকন বক্স */}
              <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                {feature.icon}
              </div>

              {/* টেক্সট কন্টেন্ট */}
              <div className='space-y-2'>
                <h3 className='text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200'>
                  {feature.title}
                </h3>
                <p className='text-gray-500 text-sm leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            </div>
          ))
        }
      </div>

    </div>
  );
};

export default FeatureSection;