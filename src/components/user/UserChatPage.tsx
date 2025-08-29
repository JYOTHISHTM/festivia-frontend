import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { userService } from "../../services/user/userService";
import { API_CONFIG, BASE_URL } from "../../config/config";
import { MessageCircle, Send, ArrowLeft, Download, Reply, X } from "lucide-react";
import HomeNavbar from '../layout/user/HomeNavbar';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const storedUser = localStorage.getItem("user");
const userId = storedUser ? JSON.parse(storedUser).id : null;

const socket = io(`${BASE_URL}`);

type Message = {
  _id?: string;
  sender: string;
  message: string;
  timestamp?: Date;
  createdAt?: string;
  creatorName: string;
  mediaUrl?: string;
  mediaType?: string;
  mediaName?: string;
  mediaSize?: number;
  replyTo?: {
    messageId: string;
    message: string;
    sender: string;
    mediaType?: string;
    mediaName?: string;
  };
};

const UserChatPage = () => {
  const { creatorId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);

  const roomId = `${userId}_${creatorId}`;

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };
  const showErrorToast = (message: string) => {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4d4d",
      stopOnFocus: true
    }).showToast();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showErrorToast('File size must be less than 10MB');
        return;
      }


      const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats'];
      const isAllowed = allowedTypes.some(type => file.type.startsWith(type));

      if (!isAllowed) {
        showErrorToast('File type not supported');
        return;
      }


      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    textareaRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  useEffect(() => {
    if (!creatorId) return;

    const fetchChatHistory = async () => {
      setLoading(true);

      const response = await userService.getChatHistory(roomId);

      if (response.success) {
        const messagesWithDate = response.data.map((msg: Message) => ({
          ...msg,
          timestamp: msg.createdAt ? new Date(msg.createdAt) : undefined,
        }));

        const sortedMessages = messagesWithDate.sort(
          (a: Message, b: Message) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0)
        );

        setMessages(sortedMessages);
      } else {
        setError(response.error!)

      }

      setLoading(false);
    };

    fetchChatHistory();
  }, [creatorId, roomId]);





  useEffect(() => {
    if (!creatorId) return;


    socket.emit("join-room", roomId);

    const handleMessage = (msg: Message) => {
      msg.timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
      setMessages((prev) => [...prev, msg]);
    };

    const handleError = (error: any) => {
      console.error("Socket error:", error);
      showErrorToast("Message error: " + (error.message || "Unknown error"));
      setUploading(false);
    };


    const handleTyping = () => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    const handleUserOnline = () => {
      setIsOnline(true);
    };

    const handleUserOffline = () => {
      setIsOnline(false);
    };

    socket.on("receive-message", handleMessage);
    socket.on("error", handleError);
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
      socket.off("error", handleError);
      socket.off("user-typing", handleTyping);
      socket.off("user-stopTyping", handleStopTyping);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
      socket.off("online-status");
      socket.emit("leave-room", roomId);
    };
  }, [creatorId, roomId]);


  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, loading]);


  useEffect(() => {
    autoResizeTextarea();
  }, [text]);

  const sendMessage = async () => {
    if ((!text.trim() && !selectedFile) || !userId || uploading) return;

    setUploading(true);

    try {
      let messageData: any = {
        roomId,
        message: text.trim() || '',
        sender: 'user',
        userId,
        creatorId,
      };

      if (replyingTo) {
        messageData.replyTo = {
          messageId: replyingTo._id,
          message: replyingTo.message,
          sender: replyingTo.sender,
          mediaType: replyingTo.mediaType,
          mediaName: replyingTo.mediaName,
        };
      }

      if (selectedFile) {
        console.log("Uploading file:", selectedFile.name);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const res = await fetch(`${BASE_URL}/${API_CONFIG.USER_ENDPOINTS.UPLOAD}`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || `Upload failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log("Upload successful:", data);

        messageData = {
          ...messageData,
          mediaUrl: data.url,
          mediaType: data.mediaType || (selectedFile.type.startsWith('image/')
            ? 'image'
            : selectedFile.type.startsWith('video/')
              ? 'video'
              : 'file'),
          mediaName: data.mediaName || selectedFile.name,
          mediaSize: data.mediaSize || selectedFile.size,
        };

        console.log("Sending media message:", messageData);
      } else {
        console.log("Sending text message:", messageData);
      }

      socket.emit('send-message', messageData);

      setText('');
      setSelectedFile(null);
      setPreviewUrl(null);
      setReplyingTo(null);
      if (textareaRef.current) textareaRef.current.style.height = "auto";

    } catch (error) {
      console.error('Send message error:', error);
      showErrorToast(
        'Failed to send message: ' + (error instanceof Error ? error.message : 'Unknown error')
      );
    }
    finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === "Escape") {
      cancelReply();
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

  const formatTime = (timestamp: Date | undefined) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return "";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderReplyPreview = (replyTo: Message['replyTo']) => {
    if (!replyTo) return null;

    return (
      <div className="mb-2 p-2 bg-gray-100 border-l-4 border-blue-400 rounded-r">
        <div className="text-xs text-blue-600 font-medium mb-1">
          Replying to {replyTo.sender === 'user' ? 'You' : 'Creator'}
        </div>
        <div className="text-sm text-gray-700 truncate">
          {replyTo.mediaType ? (
            <span className="italic">
              {replyTo.mediaType === 'image' ? '📷 Image' :
                replyTo.mediaType === 'video' ? '🎥 Video' :
                  `📎 ${replyTo.mediaName || 'File'}`}
              {replyTo.message && `: ${replyTo.message}`}
            </span>
          ) : (
            replyTo.message
          )}
        </div>
      </div>
    );
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
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-200 mb-4"></div>
          <div className="h-4 w-48 bg-green-200 rounded"></div>
          <div className="mt-2 h-3 w-32 bg-green-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <div className="text-red-500 font-medium mb-2">Error</div>
        <div className="text-gray-700">{error}</div>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 items-center justify-center">
      <HomeNavbar />

      <div className="w-full max-w-6xl flex flex-col h-[800px] bg-white rounded-lg overflow-hidden mt-30 mb-12 border border-gray-200">

        {/* Header */}
        <div className="bg-gray-800 px-4 py-3 text-white flex items-center">
          <button className="mr-3 p-1 rounded-full hover:bg-gray-700 transition" title="Back">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center font-bold">
              C
            </div>
            <div className="ml-3">
              <div className="font-semibold">Creator</div>
              <div className={`text-xs opacity-70 ${isTyping ? "text-green-500" : ""}`}>
                {isTyping ? "Typing..." : isOnline ? "Online" : "Offline"}
              </div>
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
                <p className="text-sm mt-1">Send a message to begin chatting with the creator</p>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => {
                  const isUser = msg.sender === "user";
                  const showDate =
                    idx === 0 ||
                    new Date(msg.timestamp || "").toDateString() !==
                    new Date(messages[idx - 1]?.timestamp || "").toDateString();

                  return (
                    <div key={msg._id || idx}>
                      {showDate && (
                        <div className="flex justify-center my-3">
                          <div className="text-xs bg-gray-300 text-gray-600 px-4 py-1 rounded-full">
                            {new Date(msg.timestamp || "").toLocaleDateString()}
                          </div>
                        </div>
                      )}
                      <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start group`}>
                        {!isUser && (
                          <div className="w-8 h-8 bg-gray-300 text-gray-800 flex items-center justify-center rounded-full font-semibold mr-3 mt-1">
                            C
                          </div>
                        )}
                        <div className="max-w-xs sm:max-w-md space-y-1 relative">
                          <div
                            className={`px-4 py-2 rounded-2xl relative ${isUser
                              ? "bg-green-400 text-white rounded-br-none"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                              }`}
                          >
                            {/* Reply preview */}
                            {msg.replyTo && renderReplyPreview(msg.replyTo)}

                            {msg.message && <div>{msg.message}</div>}
                            {renderMediaMessage(msg)}

                            {/* Reply button */}
                            <button
                              onClick={() => handleReply(msg)}
                              className={`absolute -right-8 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              title="Reply to this message"
                            >
                              <Reply size={14} />
                            </button>
                          </div>
                          <div className={`text-xs text-gray-400 ${isUser ? "text-right" : "text-left"}`}>
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

        <div className="bg-white border-t border-gray-200 p-4">
          {replyingTo && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-700 mb-1">
                    Replying to {replyingTo.sender === 'user' ? 'yourself' : 'Creator'}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {replyingTo.mediaType ? (
                      <span className="italic">
                        {replyingTo.mediaType === 'image' ? '📷 Image' :
                          replyingTo.mediaType === 'video' ? '🎥 Video' :
                            `📎 ${replyingTo.mediaName || 'File'}`}
                        {replyingTo.message && `: ${replyingTo.message}`}
                      </span>
                    ) : (
                      replyingTo.message
                    )}
                  </div>
                </div>
                <button
                  onClick={cancelReply}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Cancel reply"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

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
                  <X size={16} />
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
              placeholder={replyingTo ? `Reply to ${replyingTo.sender === 'user' ? 'yourself' : 'Creator'}...` : "Type a message..."}
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

          {replyingTo && (
            <div className="text-xs text-gray-500 mt-2">
              Press Escape to cancel reply
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;