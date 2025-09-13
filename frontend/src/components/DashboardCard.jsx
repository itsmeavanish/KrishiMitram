import { motion } from 'framer-motion';

const DashboardCard = ({
  title,
  icon: Icon,
  description,
  value,
  color = 'green',
  onClick,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${colorClasses[color]} border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-white ${iconColorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {value && (
          <div className="text-right">
            <p className="text-2xl font-bold">{value}</p>
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default DashboardCard;