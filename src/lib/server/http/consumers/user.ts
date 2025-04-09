import type { Cookies } from '@sveltejs/kit';
import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import { JWT_SECRET } from '$env/static/private';
import type { BaseUser, User, World } from '../types';
import jwt from 'jsonwebtoken';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

/**
 * Class for User HTTP requests targeting the Go rest API
 * @abstract
 * @class
 * @example
 * import { UserHTTP } from '$lib/server/http/consumers/user';
 * const login = async ({ req, cookies }) => {
 * 	const { username, password } = req.body;
 * 	const response = await UserHTTP.login(username, password, cookies);
 * 	return new Response(JSON.stringify(response), {
 * 		status: response.status,
 * });
 * }
 * export { login as POST };
 * @method login
 * @method register
 * @method setCookie
 *
 */
export abstract class UserHTTP extends BaseHTTP {
	/**
	 * Login a user
	 * @public
	 * @static
	 * @param {string} username - The username of the user
	 * @param {string} password - The password of the user
	 * @param {Cookies} cookies - The cookies object
	 * @returns {Promise<BaseHTTPResponse<BaseUser>>}
	 *
	 */
	public static async login(
		username: string,
		password: string,
		cookies: Cookies
	): Promise<BaseHTTPResponse<BaseUser>> {
		try {
			const endpoint = `${API_URL}/auth/login`;
			const response = await this.post(endpoint, { username, password });
			return await this.handle<BaseUser>('POST', endpoint, { username, password }, response)
				.then((response) => {
					if (response.result) {
						this.setCookie(cookies, {
							id: response.result.data.id,
							username: response.result.data.username
						});
					}
					return response;
				})
				.catch((error) => {
					return this.getErrorResponse({ error });
				});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Register a user
	 * @public
	 * @static
	 * @param {string} username - The username of the user
	 * @param {string} password - The password of the user
	 * @param {Cookies} cookies - The cookies object
	 * @returns {Promise<BaseHTTPResponse<BaseUser>>}
	 */

	public static async register(
		username: string,
		password: string,
		cookies: Cookies
	): Promise<BaseHTTPResponse<BaseUser>> {
		try {
			const endpoint = `${API_URL}/users`;
			const response = await this.post(endpoint, { username, password });

			return await this.handle<BaseUser>('POST', endpoint, { username, password }, response)
				.then((response) => {
					if (response.result) {
						this.setCookie(cookies, response.result.data);
					}
					return response;
				})
				.catch((error) => {
					return this.getErrorResponse({ error });
				});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Get the worlds of a user
	 * @public
	 * @static
	 * @param {number} userID - The ID of the user
	 * @returns {Promise<BaseHTTPResponse<User>>}
	 *
	 */
	public static async getWorlds(userID: number): Promise<BaseHTTPResponse<User>> {
		try {
			const endpoint = `${API_URL}/user/${userID}/worlds`;
			const response = await this.get(endpoint);
			return await this.handle<User>('GET', endpoint, {}, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Add a world to a user
	 * @public
	 * @static
	 * @param {number} userID - The Postgres ID of the user
	 * @param {World} world - The world to add
	 * @returns {Promise<BaseHTTPResponse<World>>}
	 *
	 */
	public static async addWorld(
		userID: number,
		{ name, description, type, continents, oceans }: World
	): Promise<BaseHTTPResponse<World>> {
		try {
			const endpoint = `${API_URL}/user/${userID}/world`;
			const response = await this.post(endpoint, {
				name,
				description,
				type,
				continents,
				oceans
			});
			return await this.handle<World>(
				'POST',
				endpoint,
				{
					name,
					description,
					type,
					continents,
					oceans
				},
				response
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * set the cookie
	 * @private
	 * @static
	 * @param {Cookies} cookies - The cookies object
	 * @returns {string}
	 *
	 */
	private static setCookie(cookies: Cookies, payload: BaseUser) {
		try {
			const token = jwt.sign(payload, JWT_SECRET);
			cookies.set('token', token, {
				httpOnly: true,
				sameSite: 'lax',
				secure: true,
				path: '/'
			});
		} catch (error) {
			console.error(error);
		}
	}
}
