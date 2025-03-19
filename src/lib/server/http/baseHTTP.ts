import { HttpStatusCodes, HTTPMethods } from '$lib/shared/http/enums';
import { type BaseHTTPResponse } from './types';
import { getErrorMessage } from '$lib/shared/error/getErrorMessage';

export abstract class BaseHTTP {
	static async post(endpoint: RequestInfo, body?: any): Promise<Response> {
		return await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body ? JSON.stringify(body) : null
		});
	}

	static async get(endpoint: RequestInfo): Promise<Response> {
		return await fetch(endpoint, {
			method: 'GET'
		});
	}

	static async put(endpoint: RequestInfo, body?: any): Promise<Response> {
		return await fetch(endpoint, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body ? JSON.stringify(body) : null
		});
	}

	static async delete(endpoint: RequestInfo): Promise<Response> {
		return await fetch(endpoint, {
			method: 'DELETE'
		});
	}

	static async handle<T>(
		method: keyof typeof HTTPMethods,
		endpoint: string,
		request: any,
		response: Response
	): Promise<BaseHTTPResponse<T>> {
		if (response.status === HttpStatusCodes.UNAUTHORIZED) {
			return this.getUnauthorizedResponse();
		}

		if (response.status >= HttpStatusCodes.BAD_REQUEST) {
			return this.getErrorResponse({
				error: this.createHTTPError(method, endpoint, request, response),
				statusCode: response.status
			});
		}

		return this.getSuccessResponse(await response.json());
	}

	static getSuccessResponse<T>(result: T): BaseHTTPResponse<T> {
		return {
			isSuccessful: true,
			result,
			statusCode: HttpStatusCodes.OK
		};
	}

	static getErrorResponse<T>({
		error,
		statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR
	}: {
		error: any;
		statusCode?: number;
	}): BaseHTTPResponse<T> {
		return {
			isSuccessful: false,
			message: getErrorMessage(error),
			statusCode
		};
	}

	static getUnauthorizedResponse<T>(): BaseHTTPResponse<T> {
		return {
			isSuccessful: false,
			message: 'Unauthorized',
			statusCode: HttpStatusCodes.UNAUTHORIZED
		};
	}

	static createHTTPError(
		method: keyof typeof HTTPMethods,
		endpoint: string,
		request: any,
		response: any
	) {
		if (request) {
			return new Error(
				`HTTP request failed: /${method} to ${endpoint} \n Payload: ${JSON.stringify(request)} \n Status: ${response.status}`
			);
		}
		return new Error(
			`HTTP request failed: /${method} to ${endpoint} \n Status: ${response.status}`
		);
	}
}
