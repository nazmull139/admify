import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
// Swiper React components এবং styles ইম্পোর্ট করা হচ্ছে
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper-এর প্রয়োজনীয় CSS ইম্পোর্ট
import 'swiper/css';
import 'swiper/css/pagination';

const StudentReviews = () => {
  // স্টুডেন্টদের রিভিউ ডাটা অ্যারে
  const reviews = [
    {
      id: 1,
      name: "Anika Rahman",
      role: "MSc in Data Science, UK",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "This platform completely changed my study abroad journey! The AI recommendations matched me with the perfect universities in the UK, and the SOP generator saved me weeks of stressful writing."
    },
    {
      id: 2,
      name: "Rakib Hassan",
      role: "BSc in Computer Science, Canada",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "I was super confused about deadlines and tracking my applications. The Application Tracking dashboard kept me organized, and I successfully got my offer letter from Canada!"
    },
    {
      id: 3,
      name: "Sajid Ahmed",
      role: "MBA, Australia",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 4,
      review: "The expert guidance combined with AI tools is the best part of this platform. The visa mock interview support gave me the confidence I needed to clear my real interview."
    },
    {
      id: 4,
      name: "Nusrat Jahan",
      role: "MS in Engineering, Germany",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Finding tuition-free universities in Germany based on my profile was incredibly easy here. Highly recommend this smart platform to anyone planning to study abroad."
    }
  ];

  return (
    <div className='bg-[#f8f9fd] py-20 px-6 md:px-16 max-w-7xl mx-auto rounded-3xl my-10'>
      
      {/* ১. সেকশনের মেইন হেডিং */}
      <div className='text-center max-w-xl mx-auto mb-16 space-y-3'>
        <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900'>
          What Our <span className='text-indigo-600'>Students Say</span>
        </h2>
        <p className='text-gray-500'>
          Discover inspiring success stories from thousands of students who achieved their dreams with us.
        </p>
      </div>

      {/* ২. রিভিউ স্লাইডার কন্টেইনার */}
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        // রেসপনসিভ ব্রেকপয়েন্ট (মোবাইলে ১টি, ডেক্সটপে ৩টি কার্ড দেখাবে)
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className="pb-14"
      >
        {reviews.map((item) => (
          <SwiperSlide key={item.id}>
            {/* মেইন রিভিউ কার্ড */}
            <div className='bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 relative flex flex-col justify-between h-[320px]'>
              
              {/* ওপরের পার্ট: কোটেশন আইকন এবং রেটিং স্টার */}
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <FaQuoteLeft className="text-3xl text-indigo-100" />
                  
                  {/* ডাইনামিক স্টার রেটিং জেনারেটর */}
                  <div className='flex text-amber-500 gap-0.5'>
                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>

                {/* রিভিউ টেক্সট */}
                <p className='text-gray-600 text-sm md:text-base leading-relaxed line-clamp-5'>
                  "{item.review}"
                </p>
              </div>

              {/* নিচের পার্ট: স্টুডেন্টের ইমেজ, নাম ও রোল */}
              <div className='flex items-center gap-4 pt-4 border-t border-gray-100 mt-auto'>
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className='w-12 h-12 rounded-full object-cover ring-2 ring-indigo-50'
                />
                <div>
                  <h4 className='text-base font-bold text-gray-900'>{item.name}</h4>
                  <p className='text-xs text-indigo-600 font-semibold'>{item.role}</p>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default StudentReviews;