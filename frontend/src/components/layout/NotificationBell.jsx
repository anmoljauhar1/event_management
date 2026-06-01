import { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { getNotifications, markNotificationRead } from '../../api/notifications';
import { WS_URL } from '../../api/axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));

    const ws = new WebSocket(`${WS_URL}/ws/notifications/`);

    ws.onmessage = (e) => {
      const notif = JSON.parse(e.data);
      setNotifications(prev => [notif, ...prev]);
    };

    return () => ws.close();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);

      setNotifications(prev =>
        prev.map(n =>
          n.id === id
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-1 rounded-full text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors"
      >
        <BellIcon className="h-6 w-6" />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          ></div>
          <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-100 ring-1 ring-black ring-opacity-5">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    All caught up! No new notifications.
                  </p>
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notif.is_read ? 'bg-indigo-50/30' : ''
                    }`}
                    onClick={() => {
                      if (notif.link) {
                        window.location.href = notif.link;
                      }
                      handleMarkRead(notif.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!notif.is_read ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                      <div className="flex-1">
                        <p className={`text-sm ${!notif.is_read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Just now
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
