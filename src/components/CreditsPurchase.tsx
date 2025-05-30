import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from './ui/dialog';

interface CreditsPurchaseProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreditsPurchase: React.FC<CreditsPurchaseProps> = ({ isOpen, onClose }) => {
  const plans = [
    {
      name: 'Free',
      credits: '5 chats',
      price: '$0',
      features: ['5 Free Chats']
    },
    {
      name: 'Starter',
      credits: 500,
      price: '$4.99',
      features: ['500 Credits', 'Access to All Features']
    },
    {
      name: 'Pro',
      credits: 1000,
      price: '$8.99',
      features: ['1000 Credits', 'Access to All Features']
    },
    {
      name: 'Premium',
      credits: 2000,
      price: '$18.99',
      features: ['2000 Credits', 'Access to All Features']
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium text-gray-800 tracking-tighter">
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-gray-600 opacity-70 text-sm">
            All plans include secure payment processing and instant credit delivery
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-4 gap-6 py-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white border border-purple-200/50 p-6 rounded-2xl relative shadow-sm"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-tighter">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-600 opacity-70">
                  {typeof plan.credits === 'number' ? `${plan.credits} Credits` : plan.credits}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600 opacity-80">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="neuro-button w-full py-3 px-4 rounded-xl text-purple-700 font-semibold">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditsPurchase;
