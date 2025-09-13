import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Volume2, User, Bot } from 'lucide-react';

const ChatBubble = ({
  sender,
  text,
  image,
  audio,
  timestamp,
  showRating = false,
  onRate,
}) => {
  const isUser = sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-xs md:max-w-md ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-green-700' : 'bg-gray-300'
        }`}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-gray-700" />
          )}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl ${
              isUser
                ? 'bg-green-700 text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
            }`}
          >
            {image && (
              <img
                src={image}
                alt="Uploaded content"
                className="rounded-lg mb-2 max-w-full h-auto"
              />
            )}
            
            {audio && (
              <div className="flex items-center space-x-2 mb-2">
                <button className={`p-2 rounded-full ${isUser ? 'bg-green-600' : 'bg-gray-200'}`}>
                  <Volume2 className={`h-4 w-4 ${isUser ? 'text-white' : 'text-gray-700'}`} />
                </button>
                <div className={`h-1 flex-1 ${isUser ? 'bg-green-600' : 'bg-gray-300'} rounded-full`}>
                  <div className={`h-1 w-1/3 ${isUser ? 'bg-green-400' : 'bg-gray-500'} rounded-full`}></div>
                </div>
              </div>
            )}
            
            {text && <p className="text-sm leading-relaxed">{text}</p>}
          </div>

          {/* Timestamp */}
          <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </p>

          {/* Rating Buttons (only for bot messages) */}
          {!isUser && showRating && (
            <div className="flex items-center space-x-2 mt-2">
              <button
                onClick={() => onRate?.('up')}
                className="p-1 rounded-full hover:bg-green-100 transition-colors"
                aria-label="Rate positive"
              >
                <ThumbsUp className="h-4 w-4 text-gray-400 hover:text-green-600" />
              </button>
              <button
                onClick={() => onRate?.('down')}
                className="p-1 rounded-full hover:bg-red-100 transition-colors"
                aria-label="Rate negative"
              >
                <ThumbsDown className="h-4 w-4 text-gray-400 hover:text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;