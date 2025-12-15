import crypto from 'crypto';

export interface PayuInitPayload {
	key: string;
	txnid: string;
	amount: string;
	productinfo: string;
	firstname: string;
	email: string;
	phone: string;
	surl: string;
	furl: string;
	udf1?: string;
	udf2?: string;
	udf3?: string;
	udf4?: string;
	udf5?: string;
}

export function generatePayuHash(
	payload: PayuInitPayload,
	salt: string,
): string {
	const {
		key,
		txnid,
		amount,
		productinfo,
		firstname,
		email,
		udf1 = '',
		udf2 = '',
		udf3 = '',
		udf4 = '',
		udf5 = '',
	} = payload;

	// PayU Formula: key|txnid|amount|productinfo|firstname|email|udf1|...|udf10|salt
	const raw = [
		key,
		txnid,
		amount,
		productinfo,
		firstname,
		email,
		udf1,
		udf2,
		udf3,
		udf4,
		udf5,
		'', // udf6
		'', // udf7
		'', // udf8
		'', // udf9
		'', // udf10
		salt,
	].join('|');

	return crypto.createHash('sha512').update(raw).digest('hex');
}

export interface PayuResponseParams {
	txnid: string;
	amount: string;
	productinfo: string;
	firstname: string;
	email: string;
	udf1?: string;
	udf2?: string;
	udf3?: string;
	udf4?: string;
	udf5?: string;
}

export function generatePayuResponseHash(
	salt: string,
	key: string, // <--- CRITICAL: Key is required for reverse hash
	status: string,
	params: PayuResponseParams,
): string {
	const {
		txnid,
		amount,
		productinfo,
		firstname,
		email,
		udf1 = '',
		udf2 = '',
		udf3 = '',
		udf4 = '',
		udf5 = '',
	} = params;

	// REVERSE HASH FORMULA:
	// SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key

	const raw = [
		salt,
		status,
		'', // udf10
		'', // udf9
		'', // udf8
		'', // udf7
		'', // udf6
		udf5,
		udf4,
		udf3,
		udf2,
		udf1,
		email,
		firstname,
		productinfo,
		amount,
		txnid,
		key, // <--- Ends with Key
	].join('|');

	return crypto.createHash('sha512').update(raw).digest('hex');
}
