import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { countriesApi } from '@/api/countries';
import { useAuth } from '@/contexts/AuthContext';
import type { Country } from '@/types/country';
import { SignupForm } from '@/components/ui/signup-form';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countryIso2, setCountryIso2] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await countriesApi.getCountries();
        setCountries(data);
      } catch (err) {
        console.error('Failed to load countries:', err);
      }
    };
    loadCountries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authApi.register({ email, password, countryIso2 });
      login(response.user);
      navigate('/games');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm 
          email={email}
          error={error}
          password={password}
          handleSubmit={handleSubmit}
          countryIso2={countryIso2}
          setEmail={setEmail}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          setCountryIso2={setCountryIso2}
          isLoading={isLoading}
          countries={countries}
        />
      </div>
    </div>
  )
}
