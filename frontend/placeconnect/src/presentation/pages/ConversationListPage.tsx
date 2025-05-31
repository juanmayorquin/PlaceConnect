/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getConversations } from "../../infrastructure/messageService";
import { Link } from "react-router-dom";

interface ConvItem {
  otherId: string;
  propertyId: string;
  name?: string;
  email?: string;
}

const ConversationListPage: React.FC = () => {
  const [convs, setConvs] = useState<ConvItem[]>([]);

  useEffect(() => {
    getConversations().then((res) =>
      setConvs(
        res.data.map(
          (c: any) =>
            ({
              otherId: c.otherId,
              propertyId: c.propertyId,
              name: c.otherName,
              email: c.otherEmail,
            } as ConvItem)
        )
      )
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Conversaciones</h1>
      <ul className="space-y-2">
        {convs.map((c) => (
          <li key={`${c.otherId}_${c.propertyId}`}>
            <Link
              to={`/conversations/${c.otherId}/${c.propertyId}`}
              className="text-blue-600 hover:underline"
            >
              Chat con {c.name} sobre propiedad {c.propertyId}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationListPage;
