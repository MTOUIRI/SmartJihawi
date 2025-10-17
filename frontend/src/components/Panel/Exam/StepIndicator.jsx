import { FileText, PenTool } from 'lucide-react';

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center mb-6">
    <div className="flex items-center">
      {[1, 2].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 2 && (
            <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default StepIndicator;