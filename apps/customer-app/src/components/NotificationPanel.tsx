import { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead, type NotificationItem } from '../api';
import { useAuth } from '../auth/AuthContext';

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const recipientId = token || 'anonymous';

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getNotifications(recipientId)
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [open, recipientId]);

  const unreadCount = list.filter((n) => !n.read).length;

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id, recipientId);
    setList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(recipientId);
    setList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600"
      >
        <span className="sr-only">Notifications</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 6v-3a4 4 0 00-4-4V9a4 4 0 00-4 4v3" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className="absolute right-0 top-full mt-1 z-50 w-80 max-h-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="p-2 border-b border-slate-100 flex justify-between items-center">
              <span className="font-medium text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <button type="button" onClick={handleMarkAllRead} className="text-xs text-emerald-600 hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-72">
              {loading ? (
                <p className="p-4 text-sm text-slate-500">Loading…</p>
              ) : list.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">No notifications yet.</p>
              ) : (
                list.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-slate-50 hover:bg-slate-50 ${!n.read ? 'bg-emerald-50/50' : ''}`}
                  >
                    <div className="flex justify-between gap-2">
                      <p className="font-medium text-slate-800 text-sm">{n.title}</p>
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(n.id)}
                          className="text-xs text-emerald-600 shrink-0"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{n.body}</p>
                    <p className="text-slate-400 text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
