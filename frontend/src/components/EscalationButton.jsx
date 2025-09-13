import { motion } from 'framer-motion';
import { UserCheck, AlertCircle } from 'lucide-react';

const EscalationButton = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="px-4 mb-4"
    >
      <motion.button
        whilePressed={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-red-100 transition-colors"
      >
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">Need Human Expert?</span>
        <UserCheck className="h-5 w-5" />
      </motion.button>
    </motion.div>
  );
};

export default EscalationButton;