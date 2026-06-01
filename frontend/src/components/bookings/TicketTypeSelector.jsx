import { useState } from 'react';
import { MinusIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';

const TicketTypeSelector = ({ ticketTypes, onProceed }) => {
  const [quantities, setQuantities] = useState({});

  const handleIncrement = (id, available) => {
    const currentQty = quantities[id] || 0;
    if (currentQty < available) {
      setQuantities({ ...quantities, [id]: currentQty + 1 });
    }
  };

  const handleDecrement = (id) => {
    const currentQty = quantities[id] || 0;
    if (currentQty > 0) {
      setQuantities({ ...quantities, [id]: currentQty - 1 });
    }
  };

  const handleSubmit = () => {
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketTypeId, qty]) => ({
        ticket_type_id: Number(ticketTypeId),
        quantity: qty,
      }));
    if (items.length === 0) {
      alert('Please select at least one ticket.');
      return;
    }
    onProceed(items);
  };

  // Calculate live total price
  const totalPrice = ticketTypes.reduce((acc, tt) => {
    const qty = quantities[tt.id] || 0;
    return acc + (tt.price * qty);
  }, 0);

  const totalQty = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center">
          <SparklesIcon className="h-5 w-5 text-indigo-500 mr-2" />
          Choose Your Tickets
        </h3>
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Step 1 of 2
        </span>
      </div>

      <div className="space-y-4">
        {ticketTypes.map((tt) => {
          const currentQty = quantities[tt.id] || 0;
          const isMaxReached = currentQty >= tt.available;
          return (
            <div
              key={tt.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-3xl border transition-all duration-300 ${
                currentQty > 0
                  ? 'border-indigo-600 bg-indigo-50/10 dark:bg-indigo-950/10'
                  : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="mb-4 sm:mb-0">
                <p className="font-extrabold text-gray-900 dark:text-white text-base">
                  {tt.name}
                </p>
                <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-lg">
                    {tt.price > 0 ? `₹${tt.price}` : 'Free'}
                  </span>
                  <span>•</span>
                  <span className="text-xs font-semibold bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {tt.available} slots left
                  </span>
                </div>
              </div>

              {/* Styled Counter Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleDecrement(tt.id)}
                  disabled={currentQty === 0}
                  className={`p-2 rounded-full border transition-all transform active:scale-90 ${
                    currentQty === 0
                      ? 'border-gray-200 text-gray-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed'
                      : 'border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-slate-950 dark:text-indigo-400 dark:hover:bg-indigo-950/40'
                  }`}
                >
                  <MinusIcon className="h-5 w-5" />
                </button>
                
                <span className="w-8 text-center text-lg font-black text-gray-800 dark:text-gray-200">
                  {currentQty}
                </span>

                <button
                  onClick={() => handleIncrement(tt.id, tt.available)}
                  disabled={isMaxReached}
                  className={`p-2 rounded-full border transition-all transform active:scale-90 ${
                    isMaxReached
                      ? 'border-gray-200 text-gray-300 dark:border-slate-800 dark:text-slate-700 cursor-not-allowed'
                      : 'border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50 dark:bg-slate-950 dark:text-indigo-400 dark:hover:bg-indigo-950/40'
                  }`}
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Total / Proceed Widget */}
      {totalQty > 0 && (
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl text-white shadow-xl space-y-4 transform scale-100 transition-all duration-300 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-white/20 pb-3">
            <div>
              <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Order Summary</p>
              <p className="text-sm font-semibold mt-0.5">{totalQty} tickets selected</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Total Price</p>
              <p className="text-2xl font-black">₹{totalPrice}</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-black rounded-full shadow-lg transform active:scale-98 transition-all duration-200"
          >
            Proceed to Checkout &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketTypeSelector;