import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Smile, Search, ChevronLeft, MoreVertical, Settings, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useChat } from "@/context/ChatContext";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export default function Messages() {
  const { 
    conversations, 
    activeConversation, 
    setActiveConversation, 
    messages, 
    sendMessage, 
    onlineUsers,
    typingUsers,
    setTyping,
    loading,
    error,
    setError
  } = useChat();

  const [messageText, setMessageText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const commonEmojis = ["😊", "👍", "😂", "❤️", "🔥", "🙌", "🏕️", "🏜️", "🎒", "🤝"];

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const otherParticipants = c.participants.filter(p => p.id !== user.id);
      const searchStr = searchTerm.toLowerCase();
      
      const matchParticipant = otherParticipants.some(p => 
        p.firstName.toLowerCase().includes(searchStr) || 
        p.lastName.toLowerCase().includes(searchStr)
      );
      
      const matchTrip = c.trip?.title.toLowerCase().includes(searchStr);
      
      return matchParticipant || matchTrip;
    });
  }, [conversations, searchTerm, user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, messageText);
    setMessageText("");
    setTyping(activeConversation.id, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (activeConversation) {
      setTyping(activeConversation.id, e.target.value.length > 0);
    }
  };

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: any[] }[] = [];
    messages.forEach(msg => {
      const date = new Date(msg.createdAt);
      let dateStr = "";
      if (isToday(date)) dateStr = "Today";
      else if (isYesterday(date)) dateStr = "Yesterday";
      else dateStr = format(date, "MMMM d, yyyy");

      const existingGroup = groups.find(g => g.date === dateStr);
      if (existingGroup) {
        existingGroup.messages.push(msg);
      } else {
        groups.push({ date: dateStr, messages: [msg] });
      }
    });
    return groups;
  }, [messages]);

  const getConversationDetails = (conv: any) => {
    if (conv.type === "GROUP") {
      return {
        name: conv.trip?.title || "Trip Group",
        avatar: conv.trip?.coverImageUrl || null,
        status: `${conv.participants.length} members`
      };
    } else {
      const other = conv.participants.find((p: any) => p.id !== user.id);
      const isOnline = onlineUsers.includes(other?.id);
      return {
        name: `${other?.firstName} ${other?.lastName}`,
        avatar: other?.avatarUrl,
        status: isOnline ? "Online" : "Away"
      };
    }
  };

  return (
    <div className="h-[calc(100vh-14rem)] flex bg-white rounded-[2.5rem] shadow-sleek border border-sage/10 overflow-hidden relative">
      {/* Sidebar */}
      <div className={`w-full lg:w-96 border-r border-sage/10 flex flex-col h-full bg-offwhite/30 ${activeConversation ? "hidden lg:flex" : "flex"}`}>
        <div className="p-8 border-b border-sage/10 bg-white">
           <h2 className="text-2xl font-black text-forest tracking-tighter italic mb-6">MESSAGES</h2>
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-forest transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search history..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-offwhite rounded-2xl border-none focus:ring-4 focus:ring-sage/20 text-sm font-bold placeholder:text-gray-300 transition-all"
              />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-sage/5">
           {filteredConversations.length > 0 ? (
             filteredConversations.map(conv => {
                const details = getConversationDetails(conv);
                const isActive = activeConversation?.id === conv.id;
                const lastMsg = conv.lastMessage;
                const isOnline = conv.type === "DIRECT" && onlineUsers.includes(conv.participants.find(p => p.id !== user.id)?.id || "");

                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full p-6 flex gap-4 text-left transition-all relative group ${
                      isActive ? "bg-white shadow-xl z-10" : "hover:bg-white/50"
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-forest rounded-r-lg" />}
                    
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-sage/20 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                         {details.avatar ? (
                           <img src={details.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                         ) : (
                           <span className="text-forest font-black uppercase text-xl">{details.name[0]}</span>
                         )}
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                       <div className="flex justify-between items-start mb-1">
                          <span className={`font-black tracking-tight truncate ${isActive ? "text-forest" : "text-forest/70"}`}>
                            {details.name}
                          </span>
                          {lastMsg && (
                            <span className="text-[10px] text-gray-300 font-black uppercase shrink-0 ml-2">
                              {formatDistanceToNow(new Date(lastMsg.createdAt), { addSuffix: false })}
                            </span>
                          )}
                       </div>
                       <div className="flex items-center gap-2">
                          <p className={`text-xs truncate font-medium flex-1 ${conv.unreadCount > 0 ? "text-forest font-bold" : "text-gray-400 font-normal"}`}>
                            {lastMsg ? lastMsg.body : "No messages yet"}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 bg-forest text-white text-[9px] font-black rounded-full flex items-center justify-center shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                       </div>
                    </div>
                  </button>
                );
             })
           ) : (
             <div className="p-12 text-center">
                <Search size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No conversations found</p>
             </div>
           )}
        </div>
      </div>

      {/* Main Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col h-full bg-white relative">
           {/* Header */}
           <div className="h-24 border-b border-sage/5 px-8 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-20">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => setActiveConversation(null)}
                  className="lg:hidden p-2 -ml-2 text-forest hover:bg-offwhite rounded-xl transition-all"
                 >
                    <ChevronLeft size={24} />
                 </button>
                 <div className="relative">
                    <div className="w-12 h-12 bg-sage/20 rounded-2xl flex items-center justify-center text-forest font-black border border-sage/10 overflow-hidden shadow-sm">
                      {getConversationDetails(activeConversation).avatar ? (
                        <img src={getConversationDetails(activeConversation).avatar!} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      ) : (
                        getConversationDetails(activeConversation).name[0]
                      )}
                    </div>
                    {activeConversation.type === "DIRECT" && onlineUsers.includes(activeConversation.participants.find(p => p.id !== user.id)?.id || "") && (
                       <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                 </div>
                 <div>
                    <h4 className="font-black text-forest leading-tight tracking-tight uppercase">{getConversationDetails(activeConversation).name}</h4>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-sage font-black uppercase tracking-widest leading-none">
                         {activeConversation.type} Chat
                       </span>
                       <div className="w-1 h-1 bg-gray-200 rounded-full" />
                       <span className="text-[10px] text-gray-400 font-bold leading-none">
                         {getConversationDetails(activeConversation).status}
                       </span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 {activeConversation.type === "GROUP" && (
                   <Button variant="outline" className="h-10 border-forest/5 rounded-xl text-forest hover:bg-forest hover:text-white transition-all">
                      <Settings size={18} />
                      <span className="hidden sm:inline ml-2 text-[10px] font-black uppercase tracking-widest">Settings</span>
                   </Button>
                 )}
                 <button className="p-2 text-gray-300 hover:text-forest transition-colors"><MoreVertical size={20} /></button>
              </div>
           </div>

           {/* Messages Scroll Area */}
           <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-offwhite/[0.15]">
              <AnimatePresence>
                {error && (
                  <motion.div 
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="sticky top-0 z-50 px-8 py-4 bg-red-500 text-white font-bold text-xs rounded-2xl shadow-xl flex items-center justify-between mb-6 group"
                  >
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                          <Settings size={16} />
                       </div>
                       {error}
                    </div>
                    <button onClick={() => setError(null)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                      <ChevronLeft className="rotate-90" size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {groupedMessages.map((group, gIdx) => (
                <div key={group.date} className="space-y-8">
                  <div className="flex justify-center group">
                    <span className="px-6 py-2 bg-white rounded-full text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] shadow-sm border border-sage/5 group-hover:text-forest transition-colors">
                      {group.date}
                    </span>
                  </div>
                  
                  {group.messages.map((msg, mIdx) => {
                    const isMe = msg.senderId === user.id;
                    const isRead = msg.readBy.length > 1; // Simplistic for group but works for DM

                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={`flex gap-4 max-w-[85%] sm:max-w-[70%] group ${isMe ? "ml-auto flex-row-reverse" : ""}`}
                      >
                         {!isMe && (
                           <div className="w-9 h-9 bg-sage/20 rounded-xl flex-shrink-0 flex items-center justify-center text-forest text-[10px] font-black overflow-hidden border border-sage/10 shadow-sm">
                             {msg.sender.avatarUrl ? (
                               <img src={msg.sender.avatarUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                             ) : (
                               msg.sender.firstName[0]
                             )}
                           </div>
                         )}
                         <div className="space-y-1 relative">
                            <div className={`p-4 md:p-5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed transition-all hover:shadow-md ${
                              isMe 
                              ? "bg-forest text-white rounded-tr-none" 
                              : "bg-white text-forest border border-forest/5 rounded-tl-none"
                            }`}>
                               {msg.body}
                               <div className={`flex items-center gap-2 mt-2 ${isMe ? "justify-end" : "justify-start opacity-0 group-hover:opacity-100 transition-opacity"}`}>
                                  <span className={`text-[9px] font-black uppercase tracking-widest ${isMe ? "text-white/40" : "text-gray-300"}`}>
                                    {format(new Date(msg.createdAt), "HH:mm")}
                                  </span>
                                  {isMe && (
                                    <div className="flex items-center ml-1">
                                      {isRead ? (
                                        <CheckCheck size={12} className="text-white" />
                                      ) : (
                                        <Check size={12} className="text-white/40" />
                                      )}
                                    </div>
                                  )}
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
              
              <AnimatePresence>
                {typingUsers[activeConversation.id]?.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 ml-12"
                  >
                    <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 bg-sage rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <div className="w-1.5 h-1.5 bg-sage rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <div className="w-1.5 h-1.5 bg-sage rounded-full animate-bounce" />
                    </div>
                    <span className="text-[10px] font-black text-sage uppercase tracking-widest italic animate-pulse">
                      {typingUsers[activeConversation.id].map(u => u.userName).join(", ")} is typing...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* Input Tooltip/Emoji Menu */}
           <AnimatePresence>
              {showEmojiPicker && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-28 right-8 z-30 bg-white p-4 rounded-[2rem] shadow-2xl border border-sage/10 grid grid-cols-5 gap-2"
                >
                   {commonEmojis.map(emoji => (
                     <button
                       key={emoji}
                       onClick={() => {
                         setMessageText(prev => prev + emoji);
                         setShowEmojiPicker(false);
                       }}
                       className="p-2 hover:bg-offwhite rounded-xl text-xl transition-all hover:scale-125"
                     >
                        {emoji}
                     </button>
                   ))}
                </motion.div>
              )}
           </AnimatePresence>

           {/* Input Bar */}
           <div className="p-6 md:p-8 shrink-0 bg-white border-t border-sage/5">
              <div className="bg-offwhite rounded-[2rem] p-2 flex items-center gap-1 border border-sage/10 relative shadow-inner">
                 <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-4 transition-all ${showEmojiPicker ? "text-forest rotate-12" : "text-gray-400 hover:text-sage"}`}
                 >
                    <Smile size={22} />
                 </button>
                 <input 
                  type="text" 
                  placeholder="Express your adventure..."
                  value={messageText}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-forest py-4 placeholder:text-gray-300"
                 />
                 <button 
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    messageText.trim() 
                    ? "bg-forest text-white shadow-xl shadow-forest/20 hover:scale-105 active:scale-95" 
                    : "bg-gray-100 text-gray-300 opacity-50 cursor-not-allowed"
                  }`}
                 >
                    <Send size={22} />
                 </button>
              </div>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-20 bg-white text-center">
           <div className="w-32 h-32 bg-offwhite rounded-[3rem] flex items-center justify-center text-gray-100 mb-8 border border-sage/10 rotate-12 group hover:rotate-0 transition-transform duration-500">
              <Send size={64} className="group-hover:text-forest/20 transition-colors" />
           </div>
           <h3 className="text-3xl font-black text-forest tracking-tighter italic uppercase mb-3">Your Inbox</h3>
           <p className="text-gray-400 font-medium max-w-sm leading-relaxed mb-8">
             Connect with verified guides or coordinate with your tribe for the next big journey.
           </p>
           <div className="flex flex-col sm:flex-row gap-4">
              <div className="px-6 py-3 bg-sage/5 rounded-2xl text-[10px] font-black text-sage uppercase tracking-widest border border-sage/10">
                 Verified Guides Only
              </div>
              <div className="px-6 py-3 bg-forest/5 rounded-2xl text-[10px] font-black text-forest uppercase tracking-widest border border-forest/10">
                 Secure Group Chats
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
