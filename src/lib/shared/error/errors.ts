import { stat } from 'fs';
import { HttpStatusCodes } from '../http/enums';

class InvalidCredentialsError extends Error {
	constructor(public message: string) {
		super(message);
	}
}

class HTTPError extends Error {
	constructor(
		public statusCode: number,
		public message: string
	) {
		super(message);
	}
}

const errorHandler = (statusCode: number, message: string): void => {
	if (statusCode === HttpStatusCodes.UNAUTHORIZED) {
		throw new InvalidCredentialsError(message);
	}
	throw new HTTPError(statusCode, message);
};

export { InvalidCredentialsError, HTTPError, errorHandler };
