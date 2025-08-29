import  { useEffect, useState } from 'react';
import { creatorService } from '../../services/creator/creatorService';

interface User {
  _id: string;
  name: string;
  email: string;
}

const ChatList = ({ creatorId }: { creatorId: string }) => {
  const [users, setUsers] = useState<User[]>([]);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await creatorService.getMessageUsers(creatorId);
      setUsers(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (creatorId) {
    fetchUsers();
  }
}, [creatorId]);


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Users Who Messaged You</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user._id}>
            <a
              href={`/creator/${creatorId}/messages/${user._id}`}
              className="text-blue-600 hover:underline"
            >
              {user.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
