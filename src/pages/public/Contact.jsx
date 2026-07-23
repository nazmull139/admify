import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaPhone } from 'react-icons/fa';

const SUPPORT_EMAIL = 'support@studyai.example.com';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // NOTE: the backend does not currently expose a /contact endpoint, so this
  // opens the visitor's email client with the message pre-filled rather than
  // silently pretending to submit somewhere.
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name || 'Study AI visitor'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen">

      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Get in Touch</h1>
          <p className="text-indigo-100/80 text-sm sm:text-base">Questions about your application, a partnership, or the platform itself? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

        <div className="md:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 shrink-0 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaEnvelope /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Email</p>
              <p className="text-sm font-black text-slate-900">{SUPPORT_EMAIL}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 shrink-0 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaPhone /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Support Line</p>
              <p className="text-sm font-black text-slate-900">Mon–Fri, 9am–6pm</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 shrink-0 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><FaMapMarkerAlt /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Operating</p>
              <p className="text-sm font-black text-slate-900">Remote-first, worldwide</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Send a Message</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text" required placeholder="Your Name" value={form.name}
              onChange={handleChange} name="name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email" required placeholder="Your Email" value={form.email}
              onChange={handleChange} name="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>
          <textarea
            required rows="6" placeholder="How can we help?" value={form.message}
            onChange={handleChange} name="message"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <FaPaperPlane /> Send Message
          </button>
          <p className="text-[11px] text-slate-400">This opens your email client with the message pre-filled to {SUPPORT_EMAIL}.</p>
        </form>

      </div>
    </div>
  );
};

export default Contact;
