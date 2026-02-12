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
          <div className="h-screen bg-slate-50 flex flex-col">
              <Navbar />
              <div className="flex-grow flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-500 mb-4 font-medium">Pre zobrazenie správ sa musíte prihlásiť.</p>
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans overflow-hidden">
      <Navbar />
      
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-80px)]">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 flex h-full overflow-hidden">
          
          {/* Sidebar (Chat List) */}
          <div className={`w-full md:w-96 border-r border-slate-200 flex flex-col bg-white ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
             {/* Header */}
             <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-bold text-xl text-slate-900 tracking-tight">Správy</h2>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"><MoreVertical size={20}/></button>
                </div>
             </div>
             
             {/* Search */}
             <div className="p-4">
                <div className="relative group">
                   <Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                   <input type="text" placeholder="Hľadať v správach..." className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 text-slate-900" />
                </div>
             </div>

             {/* Conversation List */}
             <div className="flex-grow overflow-y-auto custom-scrollbar">
                {conversations.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm font-medium">
                        Nemáte zatiaľ žiadne správy.
                    </div>
                )}
                {conversations.map(chat => (
                   <div 
                      key={chat.id} 
                      onClick={() => setActiveConversation(chat.id)}
                      className={`p-4 flex gap-3 cursor-pointer transition-all border-b border-slate-50 ${activeConversationId === chat.id ? 'bg-indigo-50/60 border-indigo-100' : 'hover:bg-slate-50'}`}
                   >
                      <div className="relative">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg overflow-hidden border border-slate-200">
                             {chat.otherUser?.avatar_url ? (
                                 <img src={chat.otherUser.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                             ) : (
                                 chat.otherUser?.full_name.charAt(0).toUpperCase()
                             )}
                         </div>
                         {/* Online indicator placeholder */}
                         {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div> */}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-0.5">
                            <h3 className={`font-bold text-sm truncate ${activeConversationId === chat.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                                {chat.otherUser?.full_name}
                            </h3>
                            <span className="text-[10px] font-medium text-slate-400">
                                {formatTime(chat.updated_at)}
                            </span>
                         </div>
                         <p className={`text-xs font-medium truncate ${activeConversationId === chat.id ? 'text-indigo-600' : 'text-slate-500'}`}>
                            {chat.listing?.title}
                         </p>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col bg-slate-50/50 ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
            {activeConversationId && activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white z-10 shadow-sm">
                   <div className="flex items-center gap-3">
                       {/* Back button for mobile */}
                       <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 transition-colors">
                           <Search className="transform rotate-180" size={20} />
                       </button>

                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-200">
                         {activeConversation.otherUser?.avatar_url ? (
                            <img src={activeConversation.otherUser.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                         ) : (
                            activeConversation.otherUser?.full_name.charAt(0).toUpperCase()
                         )}
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-900 flex items-center gap-2">
                             {activeConversation.otherUser?.full_name}
                             {activeConversation.otherUser?.verification_level === 'BANK_ID' && (
                                <span title="BankID Overený" className="flex items-center bg-indigo-50 text-indigo-600 rounded-full p-0.5">
                                   <ShieldCheck size={14} />
                                </span>
                             )}
                         </h3>
                         <p className="text-xs text-slate-500 font-medium">
                            {activeConversation.listing?.title} • <span className="text-slate-900">{activeConversation.listing?.price} €</span>
                         </p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                       <button className="p-2.5 hover:bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 transition-colors border border-transparent hover:border-slate-200">
                           <Phone size={20} />
                       </button>
                   </div>
                </div>
                
                {/* Product Context Banner (Optional - kept simple) */}
                {/* <div className="bg-indigo-50/50 px-4 py-2 flex items-center justify-center border-b border-indigo-100 text-xs text-indigo-800 font-medium">
                    Týka sa inzerátu: {activeConversation.listing?.title}
                </div> */}

                {/* Messages Feed */}
                <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6 bg-slate-50">
                   {isChatLoading ? (
                       <div className="flex h-full items-center justify-center">
                           <Loader2 className="animate-spin text-indigo-600" size={32} />
                       </div>
                   ) : messages.length === 0 ? (
                       <div className="text-center text-slate-400 mt-10">
                           <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                               <MessageCircle size={32} />
                           </div>
                           <p className="font-medium">Toto je začiatok vašej konverzácie.</p>
                       </div>
                   ) : (
                       messages.map((msg) => {
                          const isMe = msg.sender_id === user.id;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] md:max-w-[60%] rounded-2xl p-4 shadow-sm relative group ${
                                    isMe 
                                        ? 'bg-indigo-600 text-white rounded-br-none' 
                                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                                }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                                    <div className={`text-[10px] mt-1.5 flex items-center gap-1 justify-end opacity-70 ${isMe ? 'text-indigo-100' : 'text-slate-400'}`}>
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
                <div className="p-4 border-t border-slate-200 bg-white">
                   <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-2 py-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-inner">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-xl hover:bg-white">
                          <Paperclip size={20} />
                      </button>
                      <input 
                        type="text" 
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Napíšte správu..." 
                        className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 py-2 font-medium"
                      />
                      <button 
                         onClick={handleSendMessage}
                         disabled={!inputMessage.trim()}
                         className={`p-2.5 rounded-xl transition-all ${
                             inputMessage.trim() 
                               ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg transform hover:-translate-y-0.5' 
                               : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                         }`}
                      >
                          <Send size={18} />
                      </button>
                   </div>
                </div>
              </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-200 text-slate-300">
                        <MessageCircle size={40} />
                    </div>
                    <p className="font-medium text-slate-500">Vyberte konverzáciu zo zoznamu</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;