import React, { useState } from 'react';
import { FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Sidebar = ({ menuItems, activeTab, setActiveTab }) => {
  // মোবাইলে সাইডবার ওপেন/ক্লোজ করার স্টেট
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* 📱 ১. মোবাইল টগল বাটন: এটি শুধু ছোট স্ক্রিনে (lg থেকে ছোট) দেখা যাবে */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleSidebar} 
          className="bg-slate-900 text-white p-3 rounded-xl shadow-md hover:bg-slate-800 transition-all focus:outline-none flex items-center justify-center"
        >
          {isOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>
      </div>

      {/* 🌫️ ২. মোবাইল ব্যাকড্রপ ওভারলে: সাইডবার ওপেন থাকলে পেছনের স্ক্রিন আবছা করার জন্য */}
      {isOpen && (
        <div 
          onClick={toggleSidebar} 
          className="lg:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* 💻 📱 ৩. মেইন সাইডবার বডি: ডেস্কটপে ফিক্সড, মোবাইলে ড্রয়ার স্লাইডার */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-400 p-5 flex flex-col justify-between
        transition-transform duration-300 ease-in-out transform
        lg:relative lg:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          {/* লোগো সেকশন */}
          <div className="flex items-center justify-between gap-3 pl-2 mt-12 lg:mt-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">K</div>
              <span className="font-black text-white text-lg tracking-tight">Study AI Console</span>
            </div>
            <NotificationBell />
          </div>

          {/* মেনু আইটেম লিস্ট */}
          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={index}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsOpen(false); // মোবাইলে মেনু সিলেক্ট করলে সাইডবার অটো বন্ধ হবে
                  }}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                      : 'hover:bg-slate-800/60 hover:text-slate-200'}
                  `}
                >
                  <span className={`text-base ${isActive ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ফুটার পার্ট */}
        <div className="border-t border-slate-800/60 pt-4 pl-2 space-y-3">
          {user?.name && (
            <p className="text-xs font-bold text-slate-300 truncate px-2">{user.name}</p>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-rose-600/10 hover:text-rose-400 transition-all"
          >
            <FaSignOutAlt /> Log Out
          </button>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pl-2">v1.0.0 Stable</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;