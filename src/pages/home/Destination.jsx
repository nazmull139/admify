import React from 'react';
import { FaArrowLeft, FaArrowRight, FaUniversity } from 'react-icons/fa';
// Swiper React components এবং styles ইম্পোর্ট করা হচ্ছে
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper-এর প্রয়োজনীয় CSS ইম্পোর্ট
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Destination = () => {
  // দেশগুলোর ডাটা (সহজেই নতুন দেশ যোগ করতে পারবেন)
  const destinations = [
    {
      id: 1,
      country: "United Kingdom",
      universities: "160+ Universities",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      country: "United States",
      universities: "4,000+ Universities",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      country: "Canada",
      universities: "100+ Universities",
      image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      country: "Australia",
      universities: "40+ Universities",
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      country: "Germany",
      universities: "400+ Universities",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className='bg-[#f8f9fd] py-20 px-6 md:px-16 max-w-7xl mx-auto'>
      
      {/* সেকশন হেডার এবং কাস্টম নেভিগেশন বাটন */}
      <div className='flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6'>
        <div className='space-y-3'>
          <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900'>
            Popular <span className='text-indigo-600'>Study Destinations</span>
          </h2>
          <p className='text-gray-500 max-w-xl'>
            Explore the world's top educational hubs and find the perfect country for your academic growth.
          </p>
        </div>

        {/* স্লাইড বামে-ডানে নেওয়ার কাস্টম বাটন */}
        <div className='flex gap-3'>
          <button className='custom-prev-btn bg-white hover:bg-indigo-600 border border-gray-200 hover:border-indigo-600 text-gray-700 hover:text-white p-3 rounded-full transition-all duration-300 shadow-sm'>
            <FaArrowLeft />
          </button>
          <button className='custom-next-btn bg-white hover:bg-indigo-600 border border-gray-200 hover:border-indigo-600 text-gray-700 hover:text-white p-3 rounded-full transition-all duration-300 shadow-sm'>
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spacing={30}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        navigation={{
          prevEl: '.custom-prev-btn',
          nextEl: '.custom-next-btn',
        }}
        // বিভিন্ন স্ক্রিন সাইজের জন্য রেসপনসিভ ব্রেকপয়েন্ট
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 4, spaceBetween: 30 },
        }}
        className="pb-12"
      >
        {destinations.map((dest) => (
          <SwiperSlide key={dest.id}>
            {/* মেইন কার্ড বক্স */}
            <div className='group relative h-[400px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer'>
              
              {/* ব্যাকগ্রাউন্ড ইমেজ */}
              <img 
                src={dest.image} 
                alt={dest.country} 
                className='absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
              />

              {/* ছবির ওপর ডার্ক শ্যাডো/লেয়ার (তা না হলে সাদা টেক্সট দেখা যাবে না) */}
              <div className='absolute inset-0 gradient-to-t from-black/90 via-black/40 to-transparent ...'></div>

              {/* বটম কন্টেন্ট (দেশ এবং ইউনিভার্সিটির সংখ্যা) */}
              <div className='absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300'>
                <h3 className='text-2xl font-bold mb-1 tracking-wide'>
                  {dest.country}
                </h3>
                
                {/* ইউনিভার্সিটির সংখ্যা এবং আইকন */}
                <div className='flex items-center gap-2 text-indigo-300 font-medium text-sm bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl w-fit opacity-90 group-hover:opacity-100 transition-opacity'>
                  <FaUniversity className="text-xs" />
                  <span>{dest.universities}</span>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default Destination;