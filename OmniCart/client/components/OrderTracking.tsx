import React from 'react';

interface TrackingStep {
  status: string;
  date?: string | Date;
  message?: string;
  completed: boolean;
}

interface OrderTrackingProps {
  steps: TrackingStep[];
  currentStatus: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ steps, currentStatus }) => {
  return (
    <div className="py-6">
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 ml-[-1px]"></div>
        
        <div className="space-y-8 relative">
          {steps.map((step, index) => {
            const isCurrent = step.status.toLowerCase() === currentStatus.toLowerCase();
            const isCompleted = step.completed || steps.slice(index).some(s => s.status.toLowerCase() === currentStatus.toLowerCase());
            
            return (
              <div key={index} className="flex gap-6 items-start">
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-4 shadow-sm transition-all duration-500
                  ${isCompleted ? 'bg-primary border-primary/20 text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400'}`}>
                  {isCompleted ? (
                    <span className="material-icons-round text-sm">check</span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  )}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/40 -z-10"></span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-bold text-sm uppercase tracking-tight ${isCurrent ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {step.status}
                    </h4>
                    {step.date && (
                      <span className="text-[10px] font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {new Date(step.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.message || 'Updated status information.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
