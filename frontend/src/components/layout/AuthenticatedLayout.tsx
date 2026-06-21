import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CurrencyConverter } from '../currency/CurrencyConverter';

export default function AuthenticatedLayout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Casino
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Balance: {user?.balance} coins
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {user?.preferredCurrencyCode}
              </div>
              <CurrencyConverter />
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
