import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import {
  Cloud,
  Calendar,
  Gift,
  MessageSquare,
  TrendingUp,
  MapPin,
  Bell,
  BookOpen,
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardData = [
    {
      title: 'Weather Forecast',
      icon: Cloud,
      description: 'Today: Partly cloudy with light rain expected in the evening. Perfect for rice cultivation.',
      value: '28°C',
      color: 'blue',
    },
    {
      title: 'Crop Calendar',
      icon: Calendar,
      description: 'Next week: Time for preparing nursery beds for Kharif season. Check seed availability.',
      color: 'green',
    },
    {
      title: 'Subsidies & Schemes',
      icon: Gift,
      description: 'New: PM-Kisan installment available. Apply for Kisan Credit Card with zero processing fee.',
      value: '₹6,000',
      color: 'yellow',
    },
    {
      title: 'Recent Chats',
      icon: MessageSquare,
      description: 'Last discussed: Rice blast control methods. Organic farming techniques for vegetables.',
      color: 'purple',
      onClick: () => navigate('/chat'),
    },
    {
      title: 'Market Prices',
      icon: TrendingUp,
      description: 'Today: Rice ₹45/kg, Coconut ₹28/piece, Rubber ₹180/kg. All prices trending upward.',
      color: 'orange',
    },
    {
      title: 'Nearby Services',
      icon: MapPin,
      description: 'Krishi Bhavan: 2.3km away. Veterinary Hospital: 1.8km. Fertilizer shop: 0.9km.',
      color: 'blue',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, Farmer!</h1>
              <p className="text-green-100">Here's your personalized farming dashboard</p>
            </div>
            <motion.button
              whilePressed={{ scale: 0.95 }}
              className="bg-white text-green-700 p-3 rounded-full hover:bg-green-50 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-700">156</p>
              <p className="text-sm text-gray-600">Questions Asked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">89%</p>
              <p className="text-sm text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">₹12,500</p>
              <p className="text-sm text-gray-600">Subsidies Received</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">2.3 Acres</p>
              <p className="text-sm text-gray-600">Land Area</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dashboardData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <DashboardCard
                title={item.title}
                icon={item.icon}
                description={item.description}
                value={item.value}
                color={item.color}
                onClick={item.onClick}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Learning Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Resources</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Organic Farming Guide</h3>
                  <p className="text-sm text-gray-600">Complete guide to sustainable farming practices</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Market Analysis</h3>
                  <p className="text-sm text-gray-600">Weekly market trends and price forecasts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;