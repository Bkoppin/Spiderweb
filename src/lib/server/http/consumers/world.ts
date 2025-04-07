import { BaseHTTP } from '../baseHTTP';
import { type BaseHTTPResponse } from '../types';
import type { World, Continent, Ocean } from '../types';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8080/api';

/**
 * Class for World HTTP requests targeting the Go rest API
 * @abstract
 * @class
 * @example
 * import { WorldHTTP } from '$lib/server/http/consumers/world';
 * const getWorld = async ({ req }) => {
 *   const { worldID } = req.params;
 *  const response = await WorldHTTP.getWorldByID(worldID);
 * return new Response(JSON.stringify(response), {
 *  status: response.status,
 * });
 * }
 */
export abstract class WorldHTTP extends BaseHTTP {
	/**
	 * Get a world by Neo4j ID
	 * @public
	 * @static
	 * @param {string} worldID - The Neo4j ID of the world
	 * @returns {Promise<BaseHTTPResponse<World>>}
	 */
	public static async getWorldByID(worldID: string): Promise<BaseHTTPResponse<World>> {
		try {
			const endpoint = `${API_URL}/world/${worldID}`;
			const response = await this.get(endpoint);
			return await this.handle<World>('GET', endpoint, { worldID }, response).catch((error) => {
				return this.getErrorResponse({ error });
			});
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Update a world by Neo4j ID
	 * @public
	 * @static
	 * @param {string} worldID - The Neo4j ID of the world
	 * @param {World} world - The world to update
	 * @returns {Promise<BaseHTTPResponse<World>>}
	 *  */
	public static async updateWorld(
		worldID: string,
		{ name, description, type, continents, oceans }: World
	): Promise<BaseHTTPResponse<World>> {
		try {
			const endpoint = `${API_URL}/world/${worldID}`;
			const response = await this.put(endpoint, {
				name,
				description,
				type,
				continents,
				oceans
			});
			return await this.handle<World>(
				'PUT',
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
	 * Remove a world by Neo4j ID
	 * @public
	 * @static
	 * @param {string} worldID - The Neo4j ID of the world
	 * @returns {Promise<BaseHTTPResponse<World>>}
	 *  */
	public static async removeWorld(worldID: string): Promise<BaseHTTPResponse<World>> {
		try {
			const endpoint = `${API_URL}/world/${worldID}`;
			const response = await this.delete(endpoint);
			return await this.handle<World>('DELETE', endpoint, { worldID }, response);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Add a continent to a world
	 * @public
	 * @static
	 * @param {string} worldID - The Neo4j ID of the world
	 * @param {Continent} continent - The continent to add
	 * @returns {Promise<BaseHTTPResponse<World>>}
	 */
	public static async addContinent(
		worldID: string,
		{ name, description, type }: Continent
	): Promise<BaseHTTPResponse<World>> {
		try {
			const endpoint = `${API_URL}/world/${worldID}/continent`;
			const response = await this.post(endpoint, {
				name,
				description,
				type
			});
			return await this.handle<World>(
				'POST',
				endpoint,
				{
					name,
					description,
					type
				},
				response
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
	/**
	 * Add an Ocean to a world
	 * @public
	 * @static
	 * @param {string} worldID - The Neo4j ID of the world
	 * @param {Ocean} ocean - The ocean to add
	 * @returns {Promise<BaseHTTPResponse<World>>}
	 */
	public static async addOcean(
		worldID: string,
		{ name, description }: Ocean
	): Promise<BaseHTTPResponse<World>> {
		try {
			const endpoint = `${API_URL}/world/${worldID}/ocean`;
			const response = await this.post(endpoint, {
				name,
				description
			});
			return await this.handle<World>(
				'POST',
				endpoint,
				{
					name,
					description
				},
				response
			);
		} catch (error) {
			return this.getErrorResponse({ error });
		}
	}
}
