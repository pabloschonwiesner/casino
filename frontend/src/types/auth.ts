export interface User {
  id: string;
  email: string;
  balance: string;
  countryIso2: string;
  preferredCurrencyCode: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  countryIso2: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

export interface Country {
  iso2: string;
  iso3: string;
  name: string;
  flagUrl: string;
  currencyCode: string;
}
