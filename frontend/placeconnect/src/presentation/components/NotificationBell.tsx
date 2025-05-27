/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchNotifications } from '../../infrastructure/notificationService';

const NotificationBell: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  useEffect(() => { fetchNotifications().then(r=>setNotes(r.data)); }, []);
  const unread = notes.filter(n=>!n.read).length;
  return (
    <Link to="/notifications" className="relative">
      <Bell className="h-6 w-6" />
      {unread>0 && <span className="absolute top-0 right-0 h-4 w-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">{unread}</span>}
    </Link>
  );
};
export default NotificationBell;