import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import type { City } from '../types';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

/**
 * Class for City HTTP requests targeting the Go rest API
 * @abstract
 * @class
 * @example
 * import { CityHTTP } from '$lib/server/http/consumers/city';
 * const getCity = async ({ req }) => {
 *   const { cityID } = req.params;
 *  const response = await CityHTTP.getCityByID(cityID);
 * return new Response(JSON.stringify(response), {
 *  status: response.status,
 * });
 * }
 */
export abstract class CityHTTP extends BaseHTTP {
	/**
	 * * Get a city by Neo4j ID
	 * @public
	 * * @static
	 * @param {string} cityID - The Neo4j ID of the city
	 */
	public static async getCityByID(cityID: string): Promise<BaseHTTPResponse<City>> {
		try {
			const endpoint = `${API_URL}/city/${cityID}`;
			const response = await this.get(endpoint);
			return await this.handle<City>('GET', endpoint, { cityID }, response).catch((error) => {
				return this.getErrorResponse({ error });
			});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Update a city by Neo4j ID
	 * @public
	 * @static
	 * @param {string} cityID - The Neo4j ID of the city
	 * @param {City} city - The city to update
	 */
	public static async updateCity(
		cityID: string,
		{ name, description, type, capital }: City
	): Promise<BaseHTTPResponse<City>> {
		try {
			const endpoint = `${API_URL}/city/${cityID}`;
			const response = await this.put(endpoint, {
				name,
				description,
				type,
				capital
			});
			return await this.handle<City>(
				'PUT',
				endpoint,
				{ name, description, type, capital },
				response
			).catch((error) => {
				return this.getErrorResponse({ error });
			});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Remove a city by Neo4j ID
	 * @public
	 * @static
	 * @param {string} cityID - The Neo4j ID of the city
	 *
	 */
	public static async removeCity(cityID: string): Promise<BaseHTTPResponse<City>> {
		try {
			const endpoint = `${API_URL}/city/${cityID}`;
			const response = await this.delete(endpoint);
			return await this.handle<City>('DELETE', endpoint, { cityID }, response).catch((error) => {
				return this.getErrorResponse({ error });
			});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
}
