import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/user/userService';
import HomeNavbar from '../layout/user/HomeNavbar';
import { BASE_URL } from '../../config/config';
import Footer from '../layout/user/Footer';


import io from 'socket.io-client';

const socket = io(`${BASE_URL}`);

interface Chat {
  creatorName: string;
  roomId: string;
  lastMessage: string;
  timestamp: number;
}



function Messages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [typingStatus, setTypingStatus] = useState<{ [roomId: string]: boolean }>({});

  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

useEffect(() => {
let timeoutMap: { [roomId: string]: ReturnType<typeof setTimeout> } = {};

  const fetchChats = async () => {
    const response = await userService.getUserChats(userId);
    if (response.success) {
      setChats(response.data);
    } else {
      console.error("Failed to fetch chats:", response.error);
    }
  };

  if (userId) {
    fetchChats();

    socket.on('typing', (roomId: string) => {
      setTypingStatus((prev) => ({ ...prev, [roomId]: true }));

      if (timeoutMap[roomId]) clearTimeout(timeoutMap[roomId]);

      timeoutMap[roomId] = setTimeout(() => {
        setTypingStatus((prev) => ({ ...prev, [roomId]: false }));
      }, 2000);
    });

    return () => {
      socket.off('typing');
      Object.values(timeoutMap).forEach(clearTimeout);
    };
  }
}, [userId]);



  const handleChatClick = (roomId: string) => {
    const creatorId = roomId.split("_").find((id) => id !== userId);
    navigate(`/user/chat/${creatorId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HomeNavbar />

      <div className="flex-1 mt-35 px-4 py-6 flex justify-center mb-50">
        <div className="w-full max-w-4xl bg-green-50 border border-green-100 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-black text-center mb-6">Your Messages</h2>

          <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
            {chats.length > 0 ? (
              chats.map((chat, index) => {
                const timeString = new Date(chat.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={index}
                    onClick={() => handleChatClick(chat.roomId)}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg bg-white hover:bg-green-200 transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 text-white font-bold flex items-center justify-center">
                        {chat.creatorName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-black font-medium">{chat.creatorName}</p>
                        <p className="text-sm text-green-700">
                          {typingStatus[chat.roomId] ? 'typing...' : chat.lastMessage}
                        </p>

                      </div>
                    </div>
                    <div className="text-sm text-green-700 whitespace-nowrap ml-auto">
                      {timeString}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-green-600 py-6">No chats available.</p>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Messages;
