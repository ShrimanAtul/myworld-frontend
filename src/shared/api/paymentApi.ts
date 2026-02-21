import apiClient from './client';

export interface CreateOrderRequest {
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  discountCode?: string;
}

export interface CreateOrderResponse {
  providerOrderId: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export const paymentApi = {
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<CreateOrderResponse>('/payments/create-order', data);
    return response.data;
  },
};
