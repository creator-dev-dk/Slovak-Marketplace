import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useAppStore } from '../store/useStore';
import { Search, Send, MoreVertical, Paperclip, CheckCheck, Phone, ShieldCheck, MessageCircle, Loader2 } from 'lucide-react';

const Chat: React.FC = () => {
  const { 
      user, 
      conversations, 
      activeConversationId, 
      setActiveConversation, 
      messages, 
      sendMessage, 
      fetchConversations, 
      fetchMessages,
      unsubscribeFromMessages,
      isChatLoading
  } = useAppStore();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Subscription and Fetch Logic
  useEffect(() => {
      // 1. Fetch the list of conversations (sidebar)
      fetchConversations();
      
      // 2. If a conversation is selected, fetch its messages and subscribe to updates
      if (activeConversationId) {
          fetchMessages(activeConversationId);
      }
      
      // 3. Cleanup: Unsubscribe when component unmounts or ID changes
      return () => {
          unsubscribeFromMessages();
      };
  }, [activeConversationId]); // Re-run when ID changes (User clicks a different chat)

  // Scroll to bottom when messages change
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const msgToSend = inputMessage;
    setInputMessage(''); // Optimistically clear input
    await sendMessage(msgToSend);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString();
  };

  if (!user) {
      return (
          <div className="h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <div className="flex-grow flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">Pre zobrazenie správ sa musíte prihlásiť.</p>
                  </div>
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
          <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col bg-white ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
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
                {conversations.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        Nemáte zatiaľ žiadne správy.
                    </div>
                )}
                {conversations.map(chat => (
                   <div 
                      key={chat.id} 
                      onClick={() => setActiveConversation(chat.id)}
                      className={`p-4 flex gap-3 cursor-pointer transition-colors border-b border-gray-50 ${activeConversationId === chat.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                   >
                      <div className="relative">
                         <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg overflow-hidden">
                             {chat.otherUser?.avatar_url ? (
                                 <img src={chat.otherUser.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                             ) : (
                                 chat.otherUser?.full_name.charAt(0).toUpperCase()
                             )}
                         </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-0.5">
                            <h3 className="font-semibold text-sm truncate text-gray-900">
                                {chat.otherUser?.full_name}
                            </h3>
                            <span className="text-xs text-gray-400">
                                {formatTime(chat.updated_at)}
                            </span>
                         </div>
                         <p className="text-xs text-slovak-blue font-medium mb-1 truncate">{chat.listing?.title}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col bg-white ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
            {activeConversationId && activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                   <div className="flex items-center gap-3">
                       {/* Back button for mobile */}
                       <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 -ml-2 text-gray-500">
                           <Search className="transform rotate-180" size={20} />
                       </button>

                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold overflow-hidden">
                         {activeConversation.otherUser?.avatar_url ? (
                            <img src={activeConversation.otherUser.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                         ) : (
                            activeConversation.otherUser?.full_name.charAt(0).toUpperCase()
                         )}
                      </div>
                      <div>
                         <h3 className="font-bold text-gray-900 flex items-center gap-2">
                             {activeConversation.otherUser?.full_name}
                             {activeConversation.otherUser?.verification_level === 'BANK_ID' && (
                                <span title="BankID Overený" className="flex items-center">
                                   <ShieldCheck size={16} className="text-slovak-blue" />
                                </span>
                             )}
                         </h3>
                         <p className="text-xs text-gray-500 font-medium">
                            {activeConversation.listing?.title} • {activeConversation.listing?.price} €
                         </p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                       <button className="p-2.5 hover:bg-gray-100 rounded-full text-slovak-blue transition-colors">
                           <Phone size={20} />
                       </button>
                   </div>
                </div>
                
                {/* Product Context Banner */}
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100 text-sm">
                    <span className="text-gray-600">Týka sa inzerátu: <strong className="text-gray-900">{activeConversation.listing?.title}</strong></span>
                </div>

                {/* Messages Feed */}
                <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50/30">
                   {isChatLoading ? (
                       <div className="flex h-full items-center justify-center">
                           <Loader2 className="animate-spin text-slovak-blue" size={32} />
                       </div>
                   ) : messages.length === 0 ? (
                       <div className="text-center text-gray-400 mt-10">
                           Toto je začiatok vašej konverzácie.
                       </div>
                   ) : (
                       messages.map((msg) => {
                          const isMe = msg.sender_id === user.id;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                                    isMe 
                                        ? 'bg-slovak-blue text-white rounded-br-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <div className={`text-[10px] mt-1 flex items-center gap-1 justify-end ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {isMe && <CheckCheck size={14} />}
                                    </div>
                                </div>
                            </div>
                          );
                       })
                   )}
                   <div ref={messagesEndRef} />
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
                    <MessageCircle size={48} className="mb-4 opacity-20" />
                    <p>Vyberte konverzáciu zo zoznamu</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;