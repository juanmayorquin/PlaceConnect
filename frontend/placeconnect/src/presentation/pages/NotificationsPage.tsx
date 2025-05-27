/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { fetchNotifications, markNotification } from '../../infrastructure/notificationService';
import Button from '../ui/Button';

const NotificationsPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const load = () => fetchNotifications().then(r=>setNotes(r.data));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      <ul>
        {notes.map(n=>(
          <li key={n._id} className="border-b py-2 flex justify-between">
            <div>
              <p>{n.messageId.content}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </div>
            {!n.read && <Button onClick={()=>markNotification(n._id).then(load)}>Marcar leído</Button>}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default NotificationsPage;