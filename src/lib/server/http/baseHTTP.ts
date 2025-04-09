import { HttpStatusCodes, HTTPMethods } from '$lib/shared/http/enums';
import { type BaseHTTPResponse } from './types';
import { getErrorMessage } from '$lib/shared/error/getErrorMessage';

/**
 * Base class for HTTP requests
 * @abstract
 * @class
 * Extend the class and implement the methods to create a new HTTP class
 * @example
 * abstract class MyHTTP extends BaseHTTP {
 * 	static async getSomething() {
 * 		const response = await this.get('/api/something');
 * 		return this.handle(HTTPMethods.GET, '/api/something', null, response);
 * 	}
 * }
 *
 * MyHTTP.getSomething().then((response) => {
 * 	if (response.isSuccessful) {
 * 		console.log(response.result);
 * 	} else {
 * 		console.error(response.message);
 * 	}
 * });
 * @method post
 * @method get
 * @method put
 * @method delete
 * @method handle
 * @method getSuccessResponse
 * @method getErrorResponse
 * @method getUnauthorizedResponse
 * @method createHTTPError
 */
export abstract class BaseHTTP {
	/**
	 * Implements the POST HTTP method
	 * @static
	 * @param {RequestInfo} endpoint - The endpoint to send the request to
	 * @param {any} body - The body of the request
	 * @returns {Promise<Response>}
	 *
	 */

	static async post(endpoint: RequestInfo, body?: any): Promise<Response> {
		return await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body ? JSON.stringify(body) : null
		});
	}

	/**
	 * @static
	 * @param {RequestInfo} endpoint - The endpoint to send the request to
	 * @returns {Promise<Response>}
	 *
	 */

	static async get(endpoint: RequestInfo): Promise<Response> {
		return await fetch(endpoint, {
			method: 'GET'
		});
	}

	/**
	 * Implements the PUT HTTP method
	 * @static
	 * @param {RequestInfo} endpoint - The endpoint to send the request to
	 * @param {any} body - The body of the request
	 * @returns {Promise<Response>}
	 *
	 */

	static async put(endpoint: RequestInfo, body?: any): Promise<Response> {
		return await fetch(endpoint, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: body ? JSON.stringify(body) : null
		});
	}

	/**
	 * Implements the DELETE HTTP method
	 * @static
	 * @param {RequestInfo} endpoint - The endpoint to send the request to
	 * @returns {Promise<Response>}
	 *
	 */

	static async delete(endpoint: RequestInfo): Promise<Response> {
		return await fetch(endpoint, {
			method: 'DELETE'
		});
	}

	/**
	 * Handles the response of the HTTP request
	 * @static
	 * @param {keyof typeof HTTPMethods} method - The method of the request
	 * @param {string} endpoint - The endpoint of the request
	 * @param {any} request - The request payload
	 * @param {Response} response - The response of the request
	 * @returns {Promise<BaseHTTPResponse<T>>}
	 *
	 */

	static async handle<T>(
		method: keyof typeof HTTPMethods,
		endpoint: string,
		request: any,
		response: Response
	): Promise<BaseHTTPResponse<T>> {
		if (response.status === HttpStatusCodes.UNAUTHORIZED) {
			return this.getUnauthorizedResponse();
		}

		if (response.status === HttpStatusCodes.NOT_FOUND) {
			return this.getErrorResponse({
				error: new Error('Resource not found'),
				statusCode: response.status
			});
		}

		if (response.status >= HttpStatusCodes.BAD_REQUEST) {
			return this.getErrorResponse({
				error: this.createHTTPError(method, endpoint, request, response),
				statusCode: response.status
			});
		}

		return this.getSuccessResponse(await response.json());
	}

	/**
	 * Returns a successful response
	 * @static
	 * @param {T} result - The result of the request
	 * @returns {BaseHTTPResponse<T>}
	 *
	 */

	static getSuccessResponse<T>(result: T): BaseHTTPResponse<T> {
		return {
			isSuccessful: true,
			result: {
				data: result
			},
			statusCode: HttpStatusCodes.OK
		};
	}

	/**
	 * Returns an error response
	 * @static
	 * @param {any} error - The error of the request
	 * @param {number} statusCode - The status code of the response
	 * @returns {BaseHTTPResponse<T>}
	 *
	 */

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

	/**
	 * Returns an unauthorized error response
	 * @static
	 * @returns {BaseHTTPResponse<T>}
	 *
	 */

	static getUnauthorizedResponse<T>(): BaseHTTPResponse<T> {
		return {
			isSuccessful: false,
			message: 'Unauthorized',
			statusCode: HttpStatusCodes.UNAUTHORIZED
		};
	}

	/**
	 * Creates an HTTP error, for handling errors that occur during the request if they are not Unauthorized
	 * @static
	 * @param {keyof typeof HTTPMethods} method - The method of the request
	 * @param {string} endpoint - The endpoint of the request
	 * @param {any} request - The request payload
	 * @param {Response} response - The response of the request
	 * @returns {Error}
	 *
	 */

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
