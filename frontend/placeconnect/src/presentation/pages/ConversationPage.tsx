/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { sendMessage, getMessages } from "../../infrastructure/messageService";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import Input from "../ui/Input";
import Button from "../ui/Button";

const ConversationPage: React.FC = () => {
  const { otherId, propertyId } = useParams<{
    otherId: string;
    propertyId: string;
  }>();
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const load = () => {
    if (otherId && propertyId) {
      getMessages(otherId, propertyId).then((res) => setMsgs(res.data));
    }
  };
  useEffect(() => {
    load();
  }, [otherId, propertyId]);

  const handleSend = async () => {
    if (!otherId) return;
    await sendMessage({
      receiverId: otherId,
      propertyId: propertyId!,
      content,
    });
    setContent("");
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Chat</h1>
      <div className="mb-4 max-h-80 overflow-y-auto">
        {msgs.map((m) => (
          <div
            key={m._id}
            className={m.senderId === user?.id ? "text-right" : "text-left"}
          >
            <p className="inline-block p-2 bg-slate-200 rounded">{m.content}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <Button onClick={handleSend}>Enviar</Button>
      </div>
    </div>
  );
};
export default ConversationPage;
