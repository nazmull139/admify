import React from 'react';
import { FaBullseye, FaGlobeAmericas, FaHandshake, FaLightbulb, FaRobot, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router';

const values = [
  { icon: <FaRobot />, title: 'AI-Powered Guidance', desc: 'Gemini-driven university matching, SOP drafting, and admission-odds analysis tailored to each student profile.' },
  { icon: <FaHandshake />, title: 'Verified Experts', desc: 'Every agent and agency on the platform goes through an admin verification process before working with students.' },
  { icon: <FaGlobeAmericas />, title: 'Global Reach', desc: 'A growing network of verified universities across multiple countries, with transparent tuition and scholarship data.' },
  { icon: <FaBullseye />, title: 'Outcome Focused', desc: 'Every feature — from wallet credits to document review — exists to move an application from idea to offer letter.' },
];

const About = () => {
  return (
    <div className="bg-white">

      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 border border-white/10">
            <FaLightbulb className="text-amber-400" /> About Study AI
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Making Global Education Accessible</h1>
          <p className="text-indigo-100/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            We connect students with verified agents, agencies, and universities — backed by AI tools that remove the guesswork from studying abroad.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Applying to universities abroad is one of the most consequential decisions a student will make — and historically one of the most
              opaque. We built Study AI to bring transparency and intelligence to every step: matching students to the right universities based on
              real admission data, connecting them with verified consultants, and using AI to remove the friction from essays and paperwork.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Whether you're a student figuring out where to apply, an independent agent building a client base, or an agency managing a team —
              the platform is designed to give everyone a clear, actionable view of where things stand.
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center gap-3">
            <FaUsers className="text-4xl text-indigo-600" />
            <p className="text-2xl font-black text-slate-900">Students · Agents · Agencies</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">All in one platform</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex gap-4">
                <div className="w-11 h-11 shrink-0 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-lg">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-10 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl font-black text-white">Ready to start your journey?</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">Create a free account and get matched with universities in minutes.</p>
          <Link to="/register" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
            Get Started Free
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
