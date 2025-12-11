import crypto from 'crypto';

export interface PayuOrder {
	productInfo: string;
	paymentChargeSpecification: {
		price: number;
	};
}

export interface PayuBillingDetails {
	firstName: string;
	email: string;
	phone: string;
	address?: {
		address1: string;
		address2?: string;
		city: string;
		state: string;
		country: string;
		zipCode: string;
	};
}

export interface PayuCallbackActions {
	successAction: string;
	failureAction: string;
	cancelAction: string;
}

export interface PayuInitiatePayload {
	accountId: string;
	txnId: string;
	order: PayuOrder;
	billingDetails: PayuBillingDetails;
	callBackActions: PayuCallbackActions;
	additionalInfo: {
		txnFlow: 'non-seamless' | 'seamless';
		[key: string]: unknown;
	};
}

export interface PayuVerifyPayload {
	txnId: string[];
}

interface PayuUrls {
	payment: string;
	verify: string;
}

export const getPayuUrls = (env: string | undefined): PayuUrls => {
	return env === 'prod'
		? {
				payment: 'https://api.payu.in/v2/payments',
				verify: 'https://info.payu.in/v3/transaction',
		  }
		: {
				payment: 'https://apitest.payu.in/v2/payments',
				verify: 'https://test.payu.in/v3/transaction',
		  };
};

export const generatePayuSignature = (
	payload: PayuVerifyPayload | PayuInitiatePayload,
	date: string,
	secret: string,
): string => {
	const bodyString = JSON.stringify(payload);
	const signatureString = `${bodyString}|${date}|${secret}`;

	return crypto.createHash('sha512').update(signatureString).digest('hex');
};
