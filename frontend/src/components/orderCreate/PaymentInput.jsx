import React from 'react';

const PaymentInput = ({ 
  formattedPaymentDisplay, 
  setFormattedPaymentDisplay, 
  setPaymentAmount, 
  paymentAmount, 
  setPaymentError, 
  paymentError, 
  chosenPlan, 
  getPriceRange, 
  formatPriceRange 
}) => {
  if (!chosenPlan) return null;
  
  return (
    <div className="space-y-2">
      <label
        htmlFor="payment"
        className="flex items-center text-sm font-medium text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2 text-blue-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
        Nominal Pembayaran ({formatPriceRange(chosenPlan)})
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">Rp</span>
        </div>
        <input
          id="payment"
          type="text"
          inputMode="numeric"
          value={formattedPaymentDisplay}
          onChange={(e) => {
            // Get the input value and remove non-numeric characters
            const inputValue = e.target.value.replace(/[^\d]/g, "");

            // Store raw numeric value for validation and submission
            setPaymentAmount(inputValue);

            // Format with commas for display
            if (inputValue) {
              const formattedValue = new Intl.NumberFormat(
                "id-ID"
              ).format(parseInt(inputValue, 10));
              setFormattedPaymentDisplay(formattedValue);
            } else {
              setFormattedPaymentDisplay("");
            }

            // Validate if the input is within range
            if (inputValue) {
              const amount = Number(inputValue);
              const { min, max } = getPriceRange(chosenPlan);

              if (amount < min || amount > max) {
                setPaymentError(
                  `Nominal harus antara ${formatPriceRange(
                    chosenPlan
                  )}`
                );
              } else {
                setPaymentError("");
              }
            } else {
              setPaymentError("");
            }
          }}
          required
          className={`pl-10 pr-12 py-3 block w-full rounded-lg text-gray-900 border ${
            paymentError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          } outline-none transition-all duration-200 text-sm md:text-lg font-medium`}
          placeholder="Nominal pembayaran"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {paymentError ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            chosenPlan &&
            paymentAmount &&
            !paymentError && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )
          )}
        </div>
      </div>

      {/* Guidelines indicator */}
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          {paymentAmount && (
            <div
              className={`h-1.5 rounded-full ${
                paymentError ? "bg-red-500" : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    ((Number(paymentAmount) -
                      getPriceRange(chosenPlan).min) /
                      (getPriceRange(chosenPlan).max -
                        getPriceRange(chosenPlan).min)) *
                      100
                  )
                )}%`,
              }}
            ></div>
          )}
        </div>

        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>
            Min:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(getPriceRange(chosenPlan).min)}
          </span>
          <span>
            Max:{" "}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(getPriceRange(chosenPlan).max)}
          </span>
        </div>
      </div>

      {paymentError && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          {paymentError}
        </p>
      )}
    </div>
  );
};

export default PaymentInput;