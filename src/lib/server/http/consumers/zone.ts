import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import type { Zone, Location, City } from '../types';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

/**
 * Class for Zone HTTP requests targeting the Go rest API
 * @abstract
 * @class
 * @example
 * import { ZoneHTTP } from '$lib/server/http/consumers/zone';
 * const getZone = async ({ req }) => {
 *   const { zoneID } = req.params;
 *  const response = await ZoneHTTP.getZoneByID(zoneID);
 * return new Response(JSON.stringify(response), {
 *  status: response.status,
 * });
 * }
 */
export abstract class ZoneHTTP extends BaseHTTP {
	/**
	 * Get a zone by Neo4j ID
	 * @public
	 * @static
	 * @param {number} zoneID - The Neo4j ID of the zone
	 * @returns {Promise<BaseHTTPResponse<Zone>>}
	 */
	public static async getZoneByID(zoneID: number): Promise<BaseHTTPResponse<Zone>> {
		try {
			const endpoint = `${API_URL}/zone/${zoneID}`;
			const response = await this.get(endpoint);
			return await this.handle<Zone>('GET', endpoint, { zoneID }, response).catch((error) => {
				return this.getErrorResponse({ error });
			});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Update a zone by Neo4j ID
	 * @public
	 * @static
	 * @param {number} zoneID - The Neo4j ID of the zone
	 * @param {Zone} zone - The zone to update
	 * @returns {Promise<BaseHTTPResponse<Zone>>}
	 */
	public static async updateZone(
		zoneID: number,
		{ name, description, type, locations, cities }: Zone
	): Promise<BaseHTTPResponse<Zone>> {
		try {
			const endpoint = `${API_URL}/zone/${zoneID}`;
			const response = await this.put(endpoint, {
				name,
				description,
				type,
				locations,
				cities
			});
			return await this.handle<Zone>('PUT', endpoint, { name, description, type }, response).catch(
				(error) => {
					return this.getErrorResponse({ error });
				}
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Delete a zone by Neo4j ID
	 * @public
	 * @static
	 * @param {number} zoneID - The Neo4j ID of the zone
	 * @returns {Promise<BaseHTTPResponse<Zone>>}
	 */
	public static async deleteZone(zoneID: number): Promise<BaseHTTPResponse<Zone>> {
		try {
			const endpoint = `${API_URL}/zone/${zoneID}`;
			const response = await this.delete(endpoint);
			return await this.handle<Zone>('DELETE', endpoint, { zoneID }, response).catch((error) => {
				return this.getErrorResponse({ error });
			});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}

	/**
	 * Add a location to a zone by Neo4j ID
	 * @public
	 * @static
	 * @param {number} zoneID - The Neo4j ID of the zone
	 * @param {Location} location - The location to add
	 * @returns {Promise<BaseHTTPResponse<Zone>>}
	 */
	public static async addLocation(
		zoneID: number,
		{ name, description, type }: Location
	): Promise<BaseHTTPResponse<Zone>> {
		try {
			const endpoint = `${API_URL}/zone/${zoneID}/location`;
			const response = await this.post(endpoint, { name, description, type });
			return await this.handle<Zone>('POST', endpoint, { name, description, type }, response).catch(
				(error) => {
					return this.getErrorResponse({ error });
				}
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Add a city to a zone by Neo4j ID
	 * @public
	 * @static
	 * @param {number} zoneID - The Neo4j ID of the zone
	 * @param {City} city - The city to add
	 * @returns {Promise<BaseHTTPResponse<Zone>>}
	 * */
	public static async addCity(
		zoneID: number,
		{ name, description, type }: City
	): Promise<BaseHTTPResponse<Zone>> {
		try {
			const endpoint = `${API_URL}/zone/${zoneID}/city`;
			const response = await this.post(endpoint, { name, description, type });
			return await this.handle<Zone>('POST', endpoint, { name, description, type }, response).catch(
				(error) => {
					return this.getErrorResponse({ error });
				}
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
}
