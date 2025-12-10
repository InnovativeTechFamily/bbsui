import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { paymentService } from '../services';
import type { PaymentInitiateRequest, PaymentInitiateResponse, PaymentStatusResponse, PaymentCallbackRequest, PaymentCallbackResponse } from '../services';

interface PaymentState {
  // Current payment
  currentPayment: PaymentInitiateResponse | null;
  paymentStatus: PaymentStatusResponse | null;
  
  // Payment initiation state
  isInitiatingPayment: boolean;
  paymentError: string | null;
  
  // Payment status checking
  isCheckingStatus: boolean;
  statusCheckError: string | null;
  
  // Payment callback handling
  isProcessingCallback: boolean;
  callbackError: string | null;
  
  // Payment method
  selectedPaymentMethod: 'UPI' | 'CreditCard' | 'DebitCard' | 'NetBanking' | 'Wallet' | null;
  
  // Actions
  initiatePayment: (bookingId: string, paymentMethod: 'UPI' | 'CreditCard' | 'DebitCard' | 'NetBanking' | 'Wallet', paymentDetails?: any) => Promise<PaymentInitiateResponse | null>;
  checkPaymentStatus: (paymentId: string) => Promise<PaymentStatusResponse | null>;
  handlePaymentCallback: (callbackData: PaymentCallbackRequest) => Promise<PaymentCallbackResponse | null>;
  setPaymentMethod: (method: 'UPI' | 'CreditCard' | 'DebitCard' | 'NetBanking' | 'Wallet') => void;
  resetPayment: () => void;
}

const initialState = {
  currentPayment: null,
  paymentStatus: null,
  isInitiatingPayment: false,
  paymentError: null,
  isCheckingStatus: false,
  statusCheckError: null,
  isProcessingCallback: false,
  callbackError: null,
  selectedPaymentMethod: null,
};

export const usePaymentStore = create<PaymentState>()(
  devtools(
    (set) => ({
      ...initialState,

      // Set payment method
      setPaymentMethod: (method) => {
        set({ selectedPaymentMethod: method });
      },

      // Initiate payment
      initiatePayment: async (bookingId: string, paymentMethod: 'UPI' | 'CreditCard' | 'DebitCard' | 'NetBanking' | 'Wallet', paymentDetails?: any) => {
        set({ isInitiatingPayment: true, paymentError: null });
        
        try {
          const paymentRequest: PaymentInitiateRequest = {
            bookingId,
            paymentMethod,
            returnUrl: `${window.location.origin}/payment/callback`,
            ...paymentDetails,
          };

          const response = await paymentService.initiatePayment(paymentRequest);
          
          if (response.success && response.data) {
            set({
              currentPayment: response.data,
              selectedPaymentMethod: paymentMethod,
              isInitiatingPayment: false,
              paymentError: null,
            });
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to initiate payment');
          }
        } catch (error: any) {
          set({
            isInitiatingPayment: false,
            paymentError: error.message || 'Failed to initiate payment',
          });
          return null;
        }
      },

      // Check payment status
      checkPaymentStatus: async (paymentId: string) => {
        set({ isCheckingStatus: true, statusCheckError: null });
        
        try {
          const response = await paymentService.getPaymentStatus(paymentId);
          
          if (response.success && response.data) {
            set({
              paymentStatus: response.data,
              isCheckingStatus: false,
              statusCheckError: null,
            });
            return response.data;
          } else {
            throw new Error(response.message || 'Failed to check payment status');
          }
        } catch (error: any) {
          set({
            isCheckingStatus: false,
            statusCheckError: error.message || 'Failed to check payment status',
          });
          return null;
        }
      },

      // Handle payment callback
      handlePaymentCallback: async (callbackData: PaymentCallbackRequest) => {
        set({ isProcessingCallback: true, callbackError: null });
        
        try {
          const response = await paymentService.handlePaymentCallback(callbackData);
          
          if (response.success && response.data) {
            set({
              isProcessingCallback: false,
              callbackError: null,
            });
            return response.data;
          } else {
            throw new Error(response.message || 'Payment callback failed');
          }
        } catch (error: any) {
          set({
            isProcessingCallback: false,
            callbackError: error.message || 'Payment callback failed',
          });
          return null;
        }
      },

      // Reset payment state
      resetPayment: () => set({ ...initialState }),
    }),
    {
      name: 'payment-store',
    }
  )
);