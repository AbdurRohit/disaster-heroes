import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  isVisible: boolean;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 right-8 max-w-md p-4 bg-white rounded-lg shadow-lg border-l-4 border-green-500 flex items-start space-x-4"
    >
      <div className="flex-shrink-0">
        <CheckCircle className="h-6 w-6 text-green-500" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900">Success!</h3>
        <p className="mt-1 text-sm text-gray-600">
          <span> Report Submitted
            redirecting in 3 seconds...
          </span>
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Your choice has been saved and will be remembered when you return.
        </p>
      </div>
    </motion.div>
  );
};

export default SuccessMessage;