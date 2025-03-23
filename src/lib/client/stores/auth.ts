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

export function createAuthStore(): AuthStore {
	const isLoggedIn = writable(false);
	const user = writable(null);

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

	const logout = async () => {
		const response = await fetch('/api/auth/logout', {
			method: 'POST'
		});

		if (response.status === 200) {
			isLoggedIn.set(false);
			user.set(null);
		}
	};

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
