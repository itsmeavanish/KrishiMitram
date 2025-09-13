import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatBubble from '../components/ChatBubble';
import ChatInputBar from '../components/ChatInputBar';
import EscalationButton from '../components/EscalationButton';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി ഓഫീസറാണ്. കൃഷി, കാലാവസ്ഥ, സബ്സിഡികൾ എന്നിവയെ കുറിച്ച് എന്തെങ്കിലും ചോദിക്കൂ!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showRating: false,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = (userMessage) => {
    const responses = {
      weather: 'ഇന്ന് കേരളത്തിൽ മഴയ്ക്ക് സാധ്യത. നെൽകൃഷിക്ക് അനുകൂലമായ കാലാവസ്ഥയാണ്. വിത്തു വിതയ്ക്കുന്നതിന് നല്ല സമയമാണ്.',
      pest: 'നെൽവിളയിലെ പുഴുക്കളെ നിയന്ത്രിക്കാൻ ട്രൈക്കോഡെർമ ഉപയോഗിക്കൂ. രാസകീടനാശിനികൾ ഒഴിവാക്കി പ്രകൃതിദത്ത രീതികൾ സ്വീകരിക്കൂ.',
      subsidy: 'കിസാൻ ക്രെഡിറ്റ് കാർഡിനുള്ള അപേക്ഷ സമർപ്പിക്കാവുന്നതാണ്. പ്രധാനമന്ത്രി കിസാൻ സമ്മാൻ നിധി പദ്ധതിയിൽ രജിസ്റ്റർ ചെയ്യൂ.',
      organic: 'ജൈവകൃഷിക്ക് വേമ്പിൻ ചണ്ഡയും ഗോമൂത്രവും ഉപയോഗിക്കൂ. മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത വർധിപ്പിക്കാൻ കമ്പോസ്റ്റ് ചേർക്കൂ.',
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('കാലാവസ്ഥ') || lowerMessage.includes('weather') || lowerMessage.includes('മഴ')) {
      return responses.weather;
    } else if (lowerMessage.includes('പുഴു') || lowerMessage.includes('pest') || lowerMessage.includes('കീടം')) {
      return responses.pest;
    } else if (lowerMessage.includes('സബ്സിഡി') || lowerMessage.includes('subsidy') || lowerMessage.includes('പദ്ധതി')) {
      return responses.subsidy;
    } else if (lowerMessage.includes('ജൈവ') || lowerMessage.includes('organic')) {
      return responses.organic;
    }

    return 'നിങ്ങളുടെ ചോദ്യം മനസ്സിലായി. കൂടുതൽ വിവരങ്ങൾക്കായി മനുഷ്യ വിദഗ്ധനുമായി സംസാരിക്കാൻ താഴെയുള്ള ബട്ടൺ അമർത്തൂ.';
  };

  const handleSendMessage = async (text, image, audio) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const messageId = Date.now().toString();

    // Add user message
    const userMessage = {
      id: messageId,
      sender: 'user',
      text: image ? 'Photo uploaded' : audio ? 'Voice message' : text,
      image: image ? URL.createObjectURL(image) : undefined,
      audio,
      timestamp,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Show escalation button for some responses
    if (text.includes('help') || text.includes('സഹായം')) {
      setShowEscalation(true);
    }

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: generateBotResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showRating: true,
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleRateMessage = (messageId, rating) => {
    console.log(`Message ${messageId} rated: ${rating}`);
    // Update message to remove rating buttons or show feedback
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, showRating: false } : msg
      )
    );
  };

  const handleEscalation = () => {
    const escalationMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: 'നിങ്ങളെ മനുഷ്യ വിദഗ്ധനുമായി ബന്ധിപ്പിക്കുന്നു... അല്പം കാത്തിരിക്കൂ. കൃഷിഭവൻ ഓഫീസറുമായി ബന്ധിപ്പിക്കപ്പെടും.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages(prev => [...prev, escalationMessage]);
    setShowEscalation(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen bg-gray-50 pt-16"
    >
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">KO</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">KrishiMitram</h2>
            <p className="text-sm text-green-600">Online • Ready to help</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            sender={message.sender}
            text={message.text}
            image={message.image}
            audio={message.audio}
            timestamp={message.timestamp}
            showRating={message.showRating}
            onRate={(rating) => handleRateMessage(message.id, rating)}
          />
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white p-4 rounded-2xl rounded-bl-md border border-gray-200 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">KrishiMitram is typing...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Escalation Button */}
      <EscalationButton
        visible={showEscalation}
        onClick={handleEscalation}
      />

      {/* Chat Input */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        disabled={isTyping}
      />
    </motion.div>
  );
};

export default ChatPage;