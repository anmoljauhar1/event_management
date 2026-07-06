import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getChatMessages } from '../../api/chat';
import { useAuth } from '../../context/AuthContext';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { WS_URL } from '../../api/axios';

const ChatRoom = ({ roomId: propRoomId, organizerUsername }) => {
  const { id: routeId } = useParams();
  const roomId = propRoomId || routeId;
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const { data } = await getChatMessages(roomId);
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    fetchMessages();

    const ws = new WebSocket(`${WS_URL}/ws/chat/${roomId}/`);
    socketRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const incoming = JSON.parse(e.data);
        if (incoming?.message || incoming?.content) {
          setMessages((prev) => [...prev, incoming]);
        }
      } catch (error) {
        console.error('Invalid chat payload:', error);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: input }));
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[450px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-4 bg-indigo-600 dark:bg-indigo-950 text-white flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg tracking-tight">Live Event Chat</h3>
          <p className="text-xs text-indigo-200 dark:text-indigo-300 flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
            Real-time discussion with attendees
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-surface-light">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="mb-3 text-3xl">💬</div>
            <p className="text-sm font-semibold text-primary">No messages yet</p>
            <p className="text-xs text-muted mt-1 max-w-[200px]">
              Be the first to start the conversation about this event!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === user?.user?.username;
            const isOrganizer = msg.sender === organizerUsername;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="text-xs font-bold text-secondary">{msg.sender}</span>
                  {isOrganizer && (
                    <span className="bg-warning text-warning px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                      Host
                    </span>
                  )}
                  <span className="text-[10px] text-muted">
                    {msg.timestamp ? msg.timestamp.split(' ')[1] || msg.timestamp : ''}
                  </span>
                </div>
                <div
                  className={`px-4 py-2.5 rounded-2xl max-w-xs md:max-w-md text-sm shadow-sm transition-all break-words ${
                    isMe
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-surface text-primary rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.message || msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex items-center space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:text-white transition-all shadow-inner"
          placeholder={user ? "Share your thoughts..." : "Log in to chat..."}
          disabled={!user}
        />
        <button
          onClick={sendMessage}
          disabled={!user || !input.trim()}
          className={`p-2.5 rounded-full text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center ${
            !user || !input.trim()
              ? 'bg-gray-300 dark:bg-slate-800 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 dark:hover:shadow-none'
          }`}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;