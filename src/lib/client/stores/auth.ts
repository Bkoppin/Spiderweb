import { writable, type Writable } from 'svelte/store';

type User = {
	username: string;
	id: number;
};

export type AuthStore = {
	isLoggedIn: Writable<boolean>;
	checkAuth: () => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	register: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	user: Writable<null | User>;
	subscribe: (
		run: (value: null | User) => void,
		invalidate?: (value?: null | User) => void
	) => () => void;
};

/**
 * Authentication store to manage user authentication, keeps track of the user's login status, as well as the currently logged in user
 * @returns {AuthStore}
 * @property {Writable<boolean>} isLoggedIn - The user's login status
 * @property {() => Promise<void>} checkAuth - Function to check if the user is authenticated
 * @property {(username: string, password: string) => Promise<void>} login - Function to log in the user
 * @property {(username: string, password: string) => Promise<void>} register - Function to register the user
 * @property {() => Promise<void>} logout - Function to log out the user
 * @property {Writable<null | User>} user - The currently logged in user
 * @property {(run: (value: null | User) => void, invalidate?: (value?: null | User) => void) => () => void} subscribe - Function to subscribe to the user store
 *
 * @example
 * <script>
 * import { auth } from '$lib/client/stores/auth';
 * import { onMount } from 'svelte';
 *  const handleLogin = async () => {
 * 		await auth.login('username', 'password');
 * 	};
 * </script>
 * <button on:click={handleLogin}>Login</button>
 * <p>{$auth ? $auth.username : 'Not logged in'}</p>
 */
export function createAuthStore(): AuthStore {
	const isLoggedIn = writable(false);
	const user = writable(null);

	/**
	 * Function to check if the user is authenticated
	 * @returns {Promise<void>}
	 */

	const checkAuth = async () => {
		const response = await fetch('/api/users/me', {
			method: 'GET',
			credentials: 'include'
		});

		if (response.status === 200) {
			isLoggedIn.set(true);
			user.set(await response.json());
		} else {
			isLoggedIn.set(false);
			user.set(null);
		}
	};

	/**
	 * Function to log in the user
	 * @param {string} username - The username of the user
	 * @param {string} password - The password of the user
	 * @returns {Promise<void>}
	 */
	const login = async (username: string, password: string) => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (response.status === 200) {
			isLoggedIn.set(true);
			const data = await response.json();
			user.set(data.result);
		} else {
			isLoggedIn.set(false);
			user.set(null);
		}
	};

	/**
	 * Function to log out the user
	 * @returns {Promise
	 */
	const logout = async () => {
		const response = await fetch('/api/auth/logout', {
			method: 'POST'
		});

		if (response.status === 200) {
			isLoggedIn.set(false);
			user.set(null);
		}
	};

	/**
	 * Function to register the user
	 * @param {string} username - The username of the user
	 * @param {string} password - The password of the user
	 * @returns {Promise<void>}
	 */
	const register = async (username: string, password: string) => {
		const response = await fetch('/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ username, password })
		});

		if (response.status === 200) {
			isLoggedIn.set(true);
			const data = await response.json();
			user.set(data.result);
		} else {
			isLoggedIn.set(false);
			user.set(null);
		}
	};

	const subscribe = user.subscribe;

	return {
		isLoggedIn,
		checkAuth,
		login,
		logout,
		register,
		user,
		subscribe
	};
}

export const auth = createAuthStore();
