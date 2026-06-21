import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { currenciesApi } from '../../api/currencies';
import type { ConvertBalanceResponse } from '../../api/currencies';
import { useAuth } from '../../contexts/AuthContext';

export function CurrencyConverter() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [conversionResult, setConversionResult] = useState<ConvertBalanceResponse | null>(null);

  const { data: currencies = [] } = useQuery({
    queryKey: ['currencies'],
    queryFn: currenciesApi.getCurrencies,
  });

  const convertMutation = useMutation({
    mutationFn: currenciesApi.convertBalance,
    onSuccess: (data) => {
      setConversionResult(data);
    },
  });

  const handleConvert = () => {
    if (selectedCurrency) {
      convertMutation.mutate({ targetCurrency: selectedCurrency });
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>💱</span>
        <span>Convert</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Currency Converter
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Current Balance: <span className="font-bold text-gray-900 dark:text-white">${user.balance}</span>
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="currency-select"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Target Currency
                </label>
                <select
                  id="currency-select"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name} ({currency.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={convertMutation.isPending}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {convertMutation.isPending ? 'Converting...' : 'Convert'}
              </button>

              {convertMutation.isError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {(convertMutation.error as any)?.response?.data?.message || 'Conversion failed.'}
                  </p>
                </div>
              )}

              {conversionResult && (
                <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-md">
                  <div className="mb-3">
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                      ⚠️ Display Only - Your actual balance is not changed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Converted Amount:</p>
                      <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencies.find(c => c.code === conversionResult.targetCurrency)?.symbol}
                        {conversionResult.convertedBalance} {conversionResult.targetCurrency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Exchange Rate:</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        1 USD = {conversionResult.exchangeRate} {conversionResult.targetCurrency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Updated:</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {formatDate(conversionResult.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
