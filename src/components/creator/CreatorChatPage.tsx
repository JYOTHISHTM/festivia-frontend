import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { creatorService } from "../../services/creator/creatorService";
import { ArrowLeft, MessageCircle, Send, Download } from "lucide-react";
import Sidebar from "../layout/creator/SideBar";
import { uploadMedia } from '../../services/creator/creatorService';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const storedCreator = localStorage.getItem("creator");
const creatorId = storedCreator ? JSON.parse(storedCreator).id : null;
import { BASE_URL } from '../../config/config';
const socket = io(BASE_URL);
type Message = {
  _id?: string;
  sender: string;
  message: string;
  timestamp?: Date;
  createdAt?: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaName?: string;
  mediaSize?: number;
};

const CreatorChatPage = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);


  const roomId = `${userId}_${creatorId}`;


  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    console.log("selectedMedia:", setSelectedMedia);
    console.log("mediaPreview:", mediaPreview);
  }, [selectedMedia, mediaPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        Toastify({
          text: "File size must be less than 10MB",
          duration: 3000,         // Show for 3 seconds
          close: true,            // Show close button
          gravity: "top",         // "top" or "bottom"
          position: "right",      // "left", "center", or "right"
          backgroundColor: "#ff4d4d",  // Red color for error
          stopOnFocus: true       // Pause on hover
        }).showToast();
        return;
      }


      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats'];
      const isAllowed = allowedTypes.some(type => file.type.startsWith(type));

      if (!isAllowed) {
        Toastify({
          text: "File type not supported",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#ff4d4d",
          stopOnFocus: true
        }).showToast();
        return;
      }


      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }




  useEffect(() => {
    if (!creatorId) return;
    setLoading(true);

    creatorService.getChatHistory(roomId!)
      .then((res) => {
        const messagesWithDate = res.map((msg: Message) => ({
          ...msg,
          timestamp: msg.createdAt ? new Date(msg.createdAt) : undefined,
        }));

        const sortedMessages = messagesWithDate.sort(
          (a: Message, b: Message) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
        );
        setMessages(sortedMessages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chat history:", err);
        setError("Failed to load chat history");
        setLoading(false);
      });
  }, [creatorId, roomId]);


  useEffect(() => {
    if (!creatorId) return;

    console.log("Setting up socket listeners for room:", roomId);

    socket.emit("join-room", roomId);

    const handleMessage = (msg: Message) => {
      console.log("Received message:", msg);
      msg.timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
      setMessages((prev) => [...prev, msg]);
    };

    const handleTyping = () => {
      console.log("User is typing");
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      console.log("User stopped typing");
      setIsTyping(false);
    };

    const handleUserOnline = () => {
      console.log("User came online");
      setIsOnline(true);
    };

    const handleUserOffline = () => {
      console.log("User went offline");
      setIsOnline(false);
    };

    socket.on("receive-message", handleMessage);
    socket.on("user-typing", handleTyping);
    socket.on("user-stopTyping", handleStopTyping);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    socket.emit("check-online-status", roomId);
    socket.on("online-status", (status: boolean) => {
      console.log("Initial online status:", status);
      setIsOnline(status);
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("receive-message", handleMessage);
      socket.off("user-typing", handleTyping);
      socket.off("user-stopTyping", handleStopTyping);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("online-status");
      socket.emit("leave-room", roomId);
    };
  }, [creatorId, roomId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    autoResizeTextarea();
  }, [text]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);



  const sendMessage = async () => {
    if ((!text.trim() && !selectedFile) || !userId || uploading) return;

    setUploading(true);

    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const result = await uploadMedia(formData);

        if (!result.success) throw new Error(result.error);

        const { url, mediaType, mediaName, mediaSize } = result.data;

        const messageData = {
          roomId,
          message: text.trim() || '',
          mediaUrl: url,
          mediaType: mediaType || (selectedFile.type.startsWith('image/')
            ? 'image'
            : selectedFile.type.startsWith('video/')
              ? 'video'
              : 'file'),
          mediaName: mediaName || selectedFile.name,
          mediaSize: mediaSize || selectedFile.size,
          sender: 'creator',
          userId,
          creatorId,
        };

        socket.emit('send-message', messageData);
      } else {
        const messageData = {
          roomId,
          message: text.trim(),
          sender: 'creator',
          userId,
          creatorId,
        };

        socket.emit('send-message', messageData);
      }

      setText('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';

    } catch (err) {
      const error = err as Error;
      Toastify({
        text: "Failed to send message: " + error.message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#ff4d4d",
        stopOnFocus: true
      }).showToast();
    }
    finally {
      setUploading(false);
    }
  };


  useEffect(() => {
    if (!selectedMedia) {
      setMediaPreview(null);
    }
  }, [selectedMedia]);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setText(value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim()) {
      socket.emit("typing", roomId);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", roomId);
      }, 3000);
    } else {
      socket.emit("stopTyping", roomId);
    }
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (timestamp: Date | undefined) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMediaMessage = (msg: Message) => {
    if (!msg.mediaUrl) return null;

    switch (msg.mediaType) {
      case 'image':
        return (
          <div className="mt-2">
            <img
              src={msg.mediaUrl}
              alt={msg.mediaName || "Image"}
              className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
              onClick={() => window.open(msg.mediaUrl, '_blank')}
            />

          </div>
        );

      case 'video':
        return (
          <div className="mt-2">
            <video
              src={msg.mediaUrl}
              controls
              className="max-w-xs rounded-lg"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            {msg.mediaName && (
              <div className="text-xs text-gray-500 mt-1">{msg.mediaName}</div>
            )}
          </div>
        );

      case 'file':
      default:
        return (
          <div className="mt-2 p-3 bg-gray-100 rounded-lg border max-w-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded">
                <Download size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {msg.mediaName || 'File'}
                </div>
                {msg.mediaSize && (
                  <div className="text-xs text-gray-500">
                    {formatFileSize(msg.mediaSize)}
                  </div>
                )}
              </div>
              <button
                onClick={() => window.open(msg.mediaUrl, '_blank')}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Download file"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-300"></div>
          <div className="h-5 w-52 bg-blue-300 rounded"></div>
          <div className="h-4 w-40 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-100 px-4 text-center">
        <div className="text-red-600 font-semibold text-lg mb-3">Error</div>
        <div className="text-gray-700 mb-6">{error}</div>
        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat Container */}
      <div className="flex flex-col flex-1 max-w-5xl mx-auto bg-white rounded-lg border border-gray-200 overflow-hidden mt-10 mb-10">

        {/* Header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center gap-3 text-white">
          <button
            className="p-2 rounded-full hover:bg-gray-700 transition"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center font-bold select-none">
              U
            </div>
            <div>
              <h2 className="font-semibold text-base leading-tight">User</h2>

              <p className={`text-xs opacity-70 ${isTyping ? "text-green-500" : ""}`}>
                {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
              </p>

            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
          <div className="space-y-5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle size={28} className="text-green-400" />
                </div>
                <h3 className="text-lg font-medium">Start a conversation</h3>
                <p className="text-sm mt-1">Send a message to begin chatting with the user</p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => {
                  const isCreator = msg.sender === "creator";
                  const showDate =
                    idx === 0 ||
                    new Date(msg.timestamp || "").toDateString() !==
                    new Date(messages[idx - 1]?.timestamp || "").toDateString();

                  return (
                    <div key={msg._id || idx}>
                      {showDate && (
                        <div className="flex justify-center my-3">
                          <div className="text-xs bg-gray-300 text-gray-600 px-4 py-1 rounded-full select-none">
                            {new Date(msg.timestamp || "").toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      <div className={`flex ${isCreator ? "justify-end" : "justify-start"} items-start`}>
                        {!isCreator && (
                          <div className="w-8 h-8 bg-gray-300 text-gray-800 flex items-center justify-center rounded-full font-semibold mr-3 mt-1">
                            C
                          </div>
                        )}
                        <div className="max-w-xs sm:max-w-md space-y-1">
                          <div
                            className={`px-4 py-2 rounded-2xl ${isCreator
                              ? "bg-green-400 text-white rounded-br-none"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                              }`}
                          >
                            {msg.message && <div>{msg.message}</div>}
                            {renderMediaMessage(msg)}
                          </div>
                          <div className={`text-xs text-gray-400 ${isCreator ? "text-right" : "text-left"}`}>
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          {/* File preview */}
          {previewUrl && selectedFile && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {selectedFile.type.startsWith("image/") && (
                    <img src={previewUrl} alt="preview" className="w-16 h-16 object-cover rounded" />
                  )}
                  {selectedFile.type.startsWith("video/") && (
                    <video src={previewUrl} className="w-16 h-16 rounded object-cover" />
                  )}
                  {!selectedFile.type.startsWith("image/") && !selectedFile.type.startsWith("video/") && (
                    <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center">
                      <Download size={20} className="text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 items-end bg-gray-100 rounded-2xl px-4 py-3 border border-gray-300">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTyping}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 resize-none bg-transparent border-none focus:outline-none text-gray-800 min-h-[40px] max-h-[120px]"
              style={{ overflow: text.length > 100 ? "auto" : "hidden" }}
              disabled={uploading}
            />
            <input
              type="file"
              id="media-upload"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              disabled={uploading}
            />
            <label
              htmlFor="media-upload"
              className={`cursor-pointer p-2 rounded-full hover:bg-gray-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              📎
            </label>
            <button
              onClick={sendMessage}
              disabled={(!text.trim() && !selectedFile) || uploading}
              className={`p-3 rounded-full transition flex items-center justify-center ${(text.trim() || selectedFile) && !uploading
                ? "bg-green-400 hover:bg-green-500 text-white"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              aria-label="Send Message"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatorChatPage;