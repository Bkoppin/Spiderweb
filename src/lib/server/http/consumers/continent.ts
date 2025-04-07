import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import type { Continent, Ocean, Zone } from '../types';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

/**
 * Class for Continent HTTP requests targeting the Go rest API
 * @abstract
 * @class
 * @example
 * import { ContinentHTTP } from '$lib/server/http/consumers/continent';
 * const getContinent = async ({ req }) => {
 *   const { continentID } = req.params;
 *  const response = await ContinentHTTP.getContinentByID(continentID);
 * return new Response(JSON.stringify(response), {
 *  status: response.status,
 * });
 * }
 */
export abstract class ContinentHTTP extends BaseHTTP {
	/**
	 * Get a continent by Neo4j ID
	 * @public
	 * @static
	 * @param {string} continentID - The Neo4j ID of the continent
	 * @returns {Promise<BaseHTTPResponse<Continent>>}
	 */
	public static async getContinentByID(continentID: string): Promise<BaseHTTPResponse<Continent>> {
		try {
			const endpoint = `${API_URL}/continent/${continentID}`;
			const response = await this.get(endpoint);
			return await this.handle<Continent>('GET', endpoint, { continentID }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Update a continent by Neo4j ID
	 * @public
	 * @static
	 * @param {string} continentID - The Neo4j ID of the continent
	 * @param {Continent} continent - The continent to update
	 * @returns {Promise<BaseHTTPResponse<Continent>>}
	 */
	public static async updateContinent(
		continentID: string,
		{ name, description, type }: Continent
	): Promise<BaseHTTPResponse<Continent>> {
		try {
			const endpoint = `${API_URL}/continent/${continentID}`;
			const response = await this.put(endpoint, {
				name,
				description,
				type
			});
			return await this.handle<Continent>('PUT', endpoint, { name, description, type }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * * Delete a continent by Neo4j ID
	 * @public
	 * @static
	 * @param {string} continentID - The Neo4j ID of the continent
	 * @returns {Promise<BaseHTTPResponse<Continent>>}
	 */
	public static async deleteContinent(continentID: string): Promise<BaseHTTPResponse<Continent>> {
		try {
			const endpoint = `${API_URL}/continent/${continentID}`;
			const response = await this.delete(endpoint);
			return await this.handle<Continent>('DELETE', endpoint, { continentID }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Add a Zone to a continent
	 * @public
	 * @static
	 * @param {string} continentID - The Neo4j ID of the continent
	 * @param {Zone} zone - The zone to add
	 */
	public static async addZoneToContinent(
		continentID: string,
		{ name, description, type }: Zone
	): Promise<BaseHTTPResponse<Continent>> {
		try {
			const endpoint = `${API_URL}/continent/${continentID}/zone`;
			const response = await this.post(endpoint, {
				name,
				description,
				type
			});
			return await this.handle<Continent>('POST', endpoint, { name, description, type }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Add an Ocean to a continent
	 * @public
	 * @static
	 * @param {string} continentID - The Neo4j ID of the continent
	 * @param {Ocean} ocean - The ocean to add
	 * @returns {Promise<BaseHTTPResponse<Continent>>}
	 */
	public static async addOceanToContinent(
		continentID: string,
		{ name, description }: Ocean
	): Promise<BaseHTTPResponse<Continent>> {
		try {
			const endpoint = `${API_URL}/continent/${continentID}/ocean`;
			const response = await this.post(endpoint, {
				name,
				description
			});
			return await this.handle<Continent>('POST', endpoint, { name, description }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
}
