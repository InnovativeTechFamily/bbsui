import { ApiService, ApiResponse } from './api.service';
import { API_ENDPOINTS } from './api.config';

// Payment Types
export interface PaymentInitiateRequest {
  bookingId: string;
  paymentMethod: 'UPI' | 'CreditCard' | 'DebitCard' | 'NetBanking' | 'Wallet';
  returnUrl: string;
  upiId?: string; // For UPI payments
  cardDetails?: CardDetails; // For card payments
  bankCode?: string; // For net banking
  walletType?: string; // For wallet payments
}

export interface CardDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentInitiateResponse {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentGatewayUrl: string;
  paymentToken: string;
  expiresAt: string;
}

export interface PaymentStatusResponse {
  paymentId: string;
  orderId: string;
  bookingId: string;
  status: 'Pending' | 'Success' | 'Failed' | 'Cancelled' | 'Refunded';
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  paidAt?: string;
  failureReason?: string;
}

export interface PaymentCallbackRequest {
  orderId: string;
  paymentId: string;
  transactionId: string;
  status: 'Success' | 'Failed' | 'Cancelled';
  amount: number;
  currency: string;
  paymentMethod: string;
  signature: string;
  timestamp: string;
}

export interface PaymentCallbackResponse {
  bookingId: string;
  pnr: string;
  status: 'Confirmed' | 'Failed';
  paymentStatus: 'Success' | 'Failed';
  ticketUrl: string;
}

export class PaymentService extends ApiService {
  // Initiate payment
  async initiatePayment(
    paymentData: PaymentInitiateRequest
  ): Promise<ApiResponse<PaymentInitiateResponse>> {
    try {
      return await this.post<PaymentInitiateResponse>(
        API_ENDPOINTS.PAYMENTS.INITIATE,
        paymentData
      );
    } catch (error) {
      throw this.handlePaymentError(error);
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentStatusResponse>> {
    try {
      return await this.get<PaymentStatusResponse>(API_ENDPOINTS.PAYMENTS.STATUS(paymentId));
    } catch (error) {
      throw this.handlePaymentError(error);
    }
  }

  // Handle payment callback
  async handlePaymentCallback(
    callbackData: PaymentCallbackRequest
  ): Promise<ApiResponse<PaymentCallbackResponse>> {
    try {
      return await this.post<PaymentCallbackResponse>(
        API_ENDPOINTS.PAYMENTS.CALLBACK,
        callbackData
      );
    } catch (error) {
      throw this.handlePaymentError(error);
    }
  }

  // Handle payment-related errors
  private handlePaymentError(error: any): Error {
    if (error.statusCode === 400) {
      return new Error('Invalid payment details. Please check and try again.');
    }
    
    if (error.statusCode === 409) {
      return new Error('Payment is already being processed. Please wait.');
    }
    
    if (error.statusCode === 422) {
      return new Error('Payment method not supported. Please try a different method.');
    }
    
    if (error.errors && error.errors.length > 0) {
      return new Error(error.errors[0].message);
    }
    
    return new Error('Payment processing failed. Please try again.');
  }
}

// Create singleton instance
export const paymentService = new PaymentService();