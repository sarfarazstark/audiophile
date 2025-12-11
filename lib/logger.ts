import fs from 'fs';
import path from 'path';

type LogValue = string | number | boolean | Record<string, unknown> | unknown[];

const logFile = path.join(process.cwd(), 'logs.log');

export function log(value: LogValue): void {
	const pretty =
		typeof value === 'string' ? value : JSON.stringify(value, null, 2);

	fs.appendFileSync(logFile, pretty + '\n\n');
}
