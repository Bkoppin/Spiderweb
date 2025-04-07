import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import type { Location } from '../types';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

/**
 * Class for Location HTTP requests targeting the Go rest API
 * @abstract
 * @class
 * @example
 * import { LocationHTTP } from '$lib/server/http/consumers/location';
 * const getLocation = async ({ req }) => {
 *   const { locationID } = req.params;
 *  const response = await LocationHTTP.getLocationByID(locationID);
 * return new Response(JSON.stringify(response), {
 *  status: response.status,
 * });
 * }
 */
export abstract class LocationHTTP extends BaseHTTP {
	/**
	 * Get a location by Neo4j ID
	 * @public
	 * @static
	 * @param {string} locationID - The Neo4j ID of the location
	 * @returns {Promise<BaseHTTPResponse<Location>>}
	 */
	public static async getLocationByID(locationID: string): Promise<BaseHTTPResponse<Location>> {
		try {
			const endpoint = `${API_URL}/location/${locationID}`;
			const response = await this.get(endpoint);
			return await this.handle<Location>('GET', endpoint, { locationID }, response).catch(
				(error) => {
					return this.getErrorResponse({ error });
				}
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Update a location by Neo4j ID
	 * @public
	 * @static
	 * @param {string} locationID - The Neo4j ID of the location
	 * @param {Location} location - The location to update
	 * @returns {Promise<BaseHTTPResponse<Location>>}
	 */
	public static async updateLocation(
		locationID: string,
		{ name, description, type }: Location
	): Promise<BaseHTTPResponse<Location>> {
		try {
			const endpoint = `${API_URL}/location/${locationID}`;
			const response = await this.put(endpoint, {
				name,
				description,
				type
			});
			return await this.handle<Location>('PUT', endpoint, { name, description, type }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Remove a location by Neo4j ID
	 * @public
	 * @static
	 * @param {string} locationID - The Neo4j ID of the location
	 * @returns {Promise<BaseHTTPResponse<Location>>}
	 * */
	public static async removeLocation(locationID: string): Promise<BaseHTTPResponse<Location>> {
		try {
			const endpoint = `${API_URL}/location/${locationID}`;
			const response = await this.delete(endpoint);
			return await this.handle<Location>('DELETE', endpoint, { locationID }, response).catch(
				(error) => {
					return this.getErrorResponse({ error });
				}
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
}
