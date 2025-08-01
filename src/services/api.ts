import axios from 'axios';

// Environment-based configuration
const getApiBaseUrl = (): string => {
  // Use environment variable if available, fallback to production URL
  const envApiUrl = process.env.REACT_APP_API_URL;
  const defaultUrl = 'https://homeloanmittra-backend.onrender.com/api';

  if (envApiUrl) {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 API Mode: ${envApiUrl.includes('localhost') ? 'LOCAL' : 'LIVE'} backend`);
    }
    return envApiUrl;
  }

  return defaultUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Development mode logging
const isDevelopment = process.env.NODE_ENV === 'development';
const enableLogging = process.env.REACT_APP_ENABLE_LOGGING === 'true' && isDevelopment;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Development logging
    if (enableLogging) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data && Object.keys(config.data).length > 0) {
        console.log('📤 Request Data:', config.data);
      }
    }

    return config;
  },
  error => {
    if (enableLogging) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => {
    // Development logging
    if (enableLogging) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`
      );
      console.log('📥 Response Data:', response.data);
    }
    return response;
  },
  error => {
    // Development logging
    if (enableLogging) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error('Error Details:', error.response?.data || error.message);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoanOffer {
  id: string;
  bankName: string;
  bankLogo?: string;
  loanType: string;
  interestRate: number;
  processingFee: number;
  maxAmount: number;
  tenure: number[];
  eligibilityScore: number;
  features: string[];
  requirements: string[];
  monthlyEMI?: number;
  emi?: number; // alias for monthlyEMI
  totalInterest?: number;
  totalPayment?: number;
  rating?: number;
  reviewCount?: number;
}

export interface LoanComparisonRequest {
  loanAmount: number | string;
  income?: number | string;
  monthlyIncome?: number;
  location?: string;
  loanTenure?: number | string;
  tenure?: number;
  creditScore?: number;
  employmentType?: string;
  propertyType?: string;
}

// Loan API functions
export const loanAPI = {
  // Get loan offers based on criteria
  getLoanOffers: async (criteria: LoanComparisonRequest): Promise<{ data: LoanOffer[] }> => {
    try {
      const response = await api.post('/loans/compare', criteria);
      return { data: response.data.data || [] };
    } catch (error) {
      console.error('Error fetching loan offers:', error);
      throw error;
    }
  },

  // Get specific loan details
  getLoanDetails: async (loanId: string): Promise<LoanOffer> => {
    try {
      const response = await api.get(`/loans/${loanId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching loan details:', error);
      throw error;
    }
  },

  // Calculate EMI
  calculateEMI: async (
    amount: number,
    rate: number,
    tenure: number
  ): Promise<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
  }> => {
    try {
      const response = await api.post('/loans/calculate-emi', {
        amount,
        rate,
        tenure,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error calculating EMI:', error);
      throw error;
    }
  },

  // Submit loan application
  applyForLoan: async (applicationData: any): Promise<any> => {
    try {
      const response = await api.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Error applying for loan:', error);
      throw error;
    }
  },
};

export default api;
