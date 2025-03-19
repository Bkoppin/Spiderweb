import type { Cookies } from '@sveltejs/kit';
import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

type User = {
	id: number;
	username: string;
};

type LoginResponse = {
	id: number;
	username: string;
};

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

export abstract class UserHTTP extends BaseHTTP {
	public static async login(
		username: string,
		password: string,
		cookies: Cookies
	): Promise<BaseHTTPResponse<LoginResponse>> {
		try {
			const endpoint = `${API_URL}/auth/login`;
			const response = await this.post(endpoint, { username, password });
			return await this.handle<LoginResponse>('POST', endpoint, { username, password }, response)
				.then((response) => {
					if (response.result) {
						this.setCookie(cookies, response.result);
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
	public static async register(
		username: string,
		password: string,
		cookies: Cookies
	): Promise<BaseHTTPResponse<LoginResponse>> {
		try {
			const endpoint = `${API_URL}/users`;
			const response = await this.post(endpoint, { username, password });

			return await this.handle<LoginResponse>('POST', endpoint, { username, password }, response)
				.then((response) => {
					if (response.result) {
						this.setCookie(cookies, response.result);
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

	private static setCookie(cookies: Cookies, payload: User) {
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
