import React, { useEffect, useRef, useState } from 'react';
import { FaBell, FaCheckDouble, FaTimes } from 'react-icons/fa';
import { notificationService } from '../utils/services/notificationService';

const typeColor = (type) => ({
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-rose-500',
}[type] || 'bg-indigo-500');

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll();
      setItems(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch {
      // silent — notification bell shouldn't break the dashboard if this fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000); // poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      await notificationService.markOneRead(id);
      setItems((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.remove(id);
      setItems((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-colors"
      >
        <FaBell className="text-sm" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 text-slate-800">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                <FaCheckDouble /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && <p className="text-xs text-slate-400 font-semibold text-center py-6">Loading...</p>}
            {!loading && items.length === 0 && (
              <p className="text-xs text-slate-400 font-semibold text-center py-6">No notifications yet.</p>
            )}
            {!loading && items.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkOneRead(n._id)}
                className={`px-4 py-3 border-b border-slate-50 flex items-start gap-2.5 cursor-pointer hover:bg-slate-50/70 transition-colors ${!n.isRead ? 'bg-indigo-50/30' : ''}`}
              >
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColor(n.type)}`}></span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${!n.isRead ? 'font-bold text-slate-800' : 'font-medium text-slate-500'}`}>{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={(e) => handleDelete(n._id, e)} className="text-slate-300 hover:text-rose-500 transition-colors shrink-0">
                  <FaTimes className="text-[10px]" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
