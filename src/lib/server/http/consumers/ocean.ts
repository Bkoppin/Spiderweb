import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import type { Ocean } from '../types';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

/**
 * * Class for Ocean HTTP requests targeting the Go rest API
 * @abstract
 * @class
 * @example
 * import { OceanHTTP } from '$lib/server/http/consumers/ocean';
 * const getOcean = async ({ req }) => {
 *  const { oceanID } = req.params;
 * const response = await OceanHTTP.getOceanByID(oceanID);
 * return new Response(JSON.stringify(response), {
 *  status: response.status,
 * });
 * }
 * */
export abstract class OceanHTTP extends BaseHTTP {
	/**
	 * Get an ocean by Neo4j ID
	 * @public
	 * @static
	 * @param {string} oceanID - The Neo4j ID of the ocean
	 * @returns {Promise<BaseHTTPResponse<Ocean>>}
	 */
	public static async getOceanByID(oceanID: string): Promise<BaseHTTPResponse<Ocean>> {
		try {
			const endpoint = `${API_URL}/ocean/${oceanID}`;
			const response = await this.get(endpoint);
			return await this.handle<Ocean>('GET', endpoint, { oceanID }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Update an ocean by Neo4j ID
	 * @public
	 * @static
	 * @param {string} oceanID - The Neo4j ID of the ocean
	 * @param {Ocean} ocean - The ocean to update
	 * @returns {Promise<BaseHTTPResponse<Ocean>>}
	 */
	public static async updateOcean(
		oceanID: string,
		{ name, description }: Ocean
	): Promise<BaseHTTPResponse<Ocean>> {
		try {
			const endpoint = `${API_URL}/ocean/${oceanID}`;
			const response = await this.put(endpoint, {
				name,
				description
			});
			return await this.handle<Ocean>('PUT', endpoint, { name, description }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Delete an ocean by Neo4j ID
	 * @public
	 * @static
	 * @param {string} oceanID - The Neo4j ID of the ocean
	 * @returns {Promise<BaseHTTPResponse<Ocean>>}
	 * */
	public static async deleteOcean(oceanID: string): Promise<BaseHTTPResponse<Ocean>> {
		try {
			const endpoint = `${API_URL}/ocean/${oceanID}`;
			const response = await this.delete(endpoint);
			return await this.handle<Ocean>('DELETE', endpoint, { oceanID }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
}
