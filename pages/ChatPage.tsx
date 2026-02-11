import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppStore } from '../store/useStore';
import { Search, Send, MoreVertical, Paperclip, CheckCheck, Circle, Phone, Video, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data Types
interface Message {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  user: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isVerified: boolean;
  product: string;
}

const ChatPage: React.FC = () => {
  const { user, markMessagesRead } = useAppStore();
  const [activeChat, setActiveChat] = useState<string>('1');
  const [inputMessage, setInputMessage] = useState('');

  // Mock Conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      user: 'Auto Centrum ZA',
      avatar: 'A',
      lastMessage: 'Kedy by ste mohli prísť na obhliadku?',
      time: '14:20',
      unread: 1,
      isVerified: true,
      product: 'Mercedes-Benz S-Class Long'
    },
    {
      id: '2',
      user: 'Ing. Milan K.',
      avatar: 'M',
      lastMessage: 'Byt je stále voľný.',
      time: 'Včera',
      unread: 1,
      isVerified: false,
      product: '3-izbový byt, Sky Park'
    },
    {
      id: '3',
      user: 'Jana Nováková',
      avatar: 'J',
      lastMessage: 'Ďakujem za obchod, všetko super!',
      time: 'Po',
      unread: 0,
      isVerified: true,
      product: 'Rolex Datejust'
    }
  ]);

  // Mock Messages for Active Chat
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'me', text: 'Dobrý deň, mám záujem o Mercedes S-Class.', timestamp: '14:10' },
    { id: '2', sender: 'other', text: 'Dobrý deň, teší ma váš záujem. Auto je v perfektnom stave, garážované.', timestamp: '14:15' },
    { id: '3', sender: 'other', text: 'Kedy by ste mohli prísť na obhliadku?', timestamp: '14:20' },
  ]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
    
    // Simulate mock reply
    setTimeout(() => {
        setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            sender: 'other',
            text: 'Rozumiem. Termín mi vyhovuje.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
    }, 2000);
  };

  const handleChatSelect = (id: string) => {
    setActiveChat(id);
    // Mark as read mock logic
    const updatedConvs = conversations.map(c => 
        c.id === id ? { ...c, unread: 0 } : c
    );
    setConversations(updatedConvs);
    markMessagesRead();
  };

  const activeConversation = conversations.find(c => c.id === activeChat);

  if (!user) {
      return (
          <div className="h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-grow flex items-center justify-center">
                  <p className="text-gray-500">Prosím, prihláste sa.</p>
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen flex flex-col bg-slovak-light font-sans overflow-hidden">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)]">
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 flex h-full overflow-hidden">
          
          {/* Sidebar (Chat List) */}
          <div className="w-full md:w-96 border-r border-gray-100 flex flex-col bg-white">
             {/* Header */}
             <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-xl text-gray-900">Správy</h2>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><MoreVertical size={20}/></button>
                </div>
             </div>
             
             {/* Search */}
             <div className="p-4">
                <div className="relative">
                   <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                   <input type="text" placeholder="Hľadať v správach..." className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-slovak-blue focus:ring-2 focus:ring-blue-50 outline-none" />
                </div>
             </div>

             {/* Conversation List */}
             <div className="flex-grow overflow-y-auto">
                {conversations.map(chat => (
                   <div 
                      key={chat.id} 
                      onClick={() => handleChatSelect(chat.id)}
                      className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 ${activeChat === chat.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                   >
                      <div className="relative">
                         <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg">
                            {chat.avatar}
                         </div>
                         {chat.isVerified && (
                             <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                                <ShieldCheck size={14} className="text-slovak-blue fill-white" />
                             </div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-0.5">
                            <h3 className={`font-semibold text-sm truncate ${chat.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                                {chat.user}
                            </h3>
                            <span className={`text-xs ${chat.unread > 0 ? 'text-slovak-blue font-bold' : 'text-gray-400'}`}>{chat.time}</span>
                         </div>
                         <p className="text-xs text-slovak-blue font-medium mb-1 truncate">{chat.product}</p>
                         <div className="flex justify-between items-center">
                             <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                {chat.lastMessage}
                             </p>
                             {chat.unread > 0 && (
                                <span className="w-2 h-2 bg-slovak-blue rounded-full"></span>
                             )}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col bg-white ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat && activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                         {activeConversation.avatar}
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-900 flex items-center gap-2">
                             {activeConversation.user}
                             {activeConversation.isVerified && (
                                <span title="BankID Overený" className="flex items-center">
                                   <ShieldCheck size={16} className="text-slovak-blue" />
                                </span>
                             )}
                         </h3>
                         <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                         </p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                       <button className="p-2.5 hover:bg-gray-100 rounded-full text-slovak-blue transition-colors">
                           <Phone size={20} />
                       </button>
                       <button className="p-2.5 hover:bg-gray-100 rounded-full text-slovak-blue transition-colors">
                           <Video size={20} />
                       </button>
                   </div>
                </div>
                
                {/* Product Context Banner */}
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100 text-sm">
                    <span className="text-gray-600">Týka sa inzerátu: <strong className="text-gray-900">{activeConversation.product}</strong></span>
                    <a href="#" className="text-slovak-blue hover:underline font-medium">Zobraziť</a>
                </div>

                {/* Messages Feed */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/30">
                   {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                             msg.sender === 'me' 
                               ? 'bg-slovak-blue text-white rounded-br-none' 
                               : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                         }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className={`text-[10px] mt-1 flex items-center gap-1 justify-end ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'}`}>
                                {msg.timestamp}
                                {msg.sender === 'me' && <CheckCheck size={14} />}
                            </div>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white">
                   <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-slovak-blue/20 focus-within:border-slovak-blue transition-all">
                      <button className="text-gray-400 hover:text-gray-600">
                          <Paperclip size={20} />
                      </button>
                      <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Napíšte správu..." 
                        className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 py-2"
                      />
                      <button 
                         onClick={handleSendMessage}
                         disabled={!inputMessage.trim()}
                         className={`p-2 rounded-xl transition-all ${
                             inputMessage.trim() 
                               ? 'bg-slovak-blue text-white shadow-md transform hover:scale-105' 
                               : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                         }`}
                      >
                          <Send size={18} />
                      </button>
                   </div>
                </div>
              </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare size={48} className="mb-4 opacity-20" />
                    <p>Vyberte konverzáciu zo zoznamu</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;