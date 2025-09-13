import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Smartphone, Award } from 'lucide-react';

const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
              >
                KrishiMitram
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-green-700 mb-8 font-medium"
              >
                Always available, always farmer-first.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-gray-600 mb-12"
              >
                Get instant agricultural advice, crop management tips, weather updates, and government scheme information - all in Malayalam, through voice, text, or images.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <Link
                  to="/chat"
                  className="bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-800 transition-all duration-200 transform hover:scale-105 text-center"
                >
                  Start Chat
                </Link>
                <button className="border-2 border-green-700 text-green-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-green-700 hover:text-white transition-all duration-200 transform hover:scale-105">
                  Learn More
                </button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md">
                <div className="bg-green-100 rounded-2xl p-6 mb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Krishi Officer</h3>
                      <p className="text-sm text-green-600">Online</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm text-gray-700">നിങ്ങളുടെ വിളയെ കുറിച്ച് എന്നോട് ചോദിക്കൂ!</p>
                    </div>
                    <div className="bg-green-700 text-white p-3 rounded-lg ml-8">
                      <p className="text-sm">എന്റെ നെല്ല് വിളയിൽ പുഴു കാണുന്നു</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Digital Krishi Officer?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering farmers with modern technology and traditional wisdom
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: 'Multi-Modal Communication',
                description: 'Talk, type, or send photos - we understand Malayalam in all forms.',
              },
              {
                icon: Smartphone,
                title: 'Always Accessible',
                description: '24/7 availability on your mobile device, even in remote areas.',
              },
              {
                icon: Award,
                title: 'Expert Knowledge',
                description: 'Backed by agricultural experts and government departments.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <feature.icon className="h-12 w-12 text-green-700 mb-6" />
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Transform Your Farming?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-green-100 mb-8"
          >
            Join thousands of farmers already using Digital Krishi Officer
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/chat"
              className="bg-white text-green-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 inline-block"
            >
              Start Your First Chat
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;