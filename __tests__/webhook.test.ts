import { test, expect, mock } from 'bun:test';

// Mock the generatePayuResponseHash since we just want to verify logic flow
mock.module('@/lib/payu', () => ({
	generatePayuResponseHash: () => 'mock_expected_hash',
}));

mock.module('@/lib/prisma', () => ({
	prisma: {
		payment: {
			findUnique: async () => ({ id: 'mock_txnid', status: 'PENDING' }),
			update: async () => ({}),
		},
	},
}));

mock.module('axios', () => ({
	default: {
		post: async () => ({
			data: {
				status: 1,
				transaction_details: {
					mock_txnid: { status: 'success', mihpayid: 'mock_mihpayid' },
				},
			},
		}),
	},
}));

// Mock the NextRequest
class MockNextRequest {
	formDataValue: Map<string, string>;
	constructor(data: Record<string, string>) {
		this.formDataValue = new Map(Object.entries(data));
	}
	async formData() {
		return {
			get: (key: string) => this.formDataValue.get(key) || null,
		};
	}
}

test('Webhook successfully processes valid hash and PayU verification', async () => {
	const { POST } = await import('@/app/api/webhook/payu/route');

	process.env.PAYU_MERCHANT_SALT = 'mock_salt';
	process.env.PAYU_MERCHANT_KEY = 'mock_key';
	process.env.PAYU_ENV = 'test';

	const mockReq = new MockNextRequest({
		txnid: 'mock_txnid',
		status: 'success',
		amount: '100',
		productinfo: 'test product',
		email: 'test@example.com',
		firstname: 'John',
		hash: 'mock_expected_hash', // matching expected hash
	}) as any;

	const response = await POST(mockReq);
	const data = await response.json();

	expect(response.status).toBe(200);
	expect(data).toEqual({ status: 'ok' });
});

test('Webhook fails with invalid hash', async () => {
	const { POST } = await import('@/app/api/webhook/payu/route');

	const mockReq = new MockNextRequest({
		txnid: 'mock_txnid',
		status: 'success',
		amount: '100',
		productinfo: 'test product',
		email: 'test@example.com',
		firstname: 'John',
		hash: 'invalid_hash', // mismatching hash
	}) as any;

	const response = await POST(mockReq);
	const data = await response.json();

	expect(response.status).toBe(200); // the code returns 200 but handles internally
	expect(data).toEqual({ message: 'Invalid Hash' });
});
