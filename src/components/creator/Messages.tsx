import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creatorService } from '../../services/creator/creatorService';
import SidebarNavigation from '../layout/creator/SideBar';
import { Search } from 'lucide-react';

interface Chat {
  nameFromUser: string | null | undefined;  
  roomId: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
  online?: boolean;
}

function Messages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('recent');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const creatorData = localStorage.getItem("creator");
  const creatorId = JSON.parse(creatorData || "{}")?.id;
useEffect(() => {
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      if (creatorId) {
        const data = await creatorService.getCreatorChats(creatorId);
        setChats(data.map((chat: Chat) => ({
          ...chat,
          lastMessageTime: new Date().toISOString(), 
          unread: Math.random() > 0.5,                
          online: Math.random() > 0.5                 
        })));
      }
    } catch (err) {
      console.error("❌ Error fetching chats:", err);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchChats();
}, [creatorId]);


  const handleChatClick = (roomId: string) => {
    const userId = roomId.split("_").find((id) => id !== creatorId);
    navigate(`/creator/chat/${userId}`);
  };

  const filteredChats = chats.filter(chat =>
    (chat.nameFromUser ?? 'Other').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNavigation />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex items-center justify-between py-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      {['Recent', 'Unread', 'Alphabetical'].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortOption(option.toLowerCase());
                            setFilterOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            sortOption === option.toLowerCase()
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          {/* Search */}
          <div className="py-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              />
            </div>
          </div>
          
          {/* Chat list */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center p-4 bg-white rounded-lg animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations found</h3>
                <p className="text-sm text-gray-500">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.roomId}
                    onClick={() => handleChatClick(chat.roomId)}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      chat.unread ? 'bg-blue-50' : 'bg-white'
                    } hover:bg-gray-50 border border-gray-100`}
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                        chat.unread ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {getInitials(chat.nameFromUser ?? 'Other')}
                      </div>
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className={`font-medium ${chat.unread ? 'text-gray-900' : 'text-gray-700'} truncate`}>
                          {chat.nameFromUser ?? 'Other'}
                        </h3>
                        {chat.lastMessageTime && (
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      {chat.lastMessage && (
                        <p className={`text-sm truncate mt-1 ${chat.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {chat.lastMessage}
                        </p>
                      )}
                    </div>
                    
                    {chat.unread && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full ml-3"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Messages;
