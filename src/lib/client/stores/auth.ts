import { invalidateAll } from '$app/navigation';
import { writable, type Writable } from 'svelte/store';

type User = {
	username: string;
	id: number;
};

interface AuthState {
	isLoggedIn: boolean;
	user: User | null;
}

export interface AuthStore {
	subscribe: Writable<AuthState>['subscribe'];
	checkAuth: () => Promise<void>;
	login: (username: string, password: string) => Promise<void>;
	register: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export function createAuthStore(): AuthStore {
	const store = writable<AuthState>({
		isLoggedIn: false,
		user: null
	});

	const { subscribe, set } = store;

	const checkAuth = async () => {
		try {
			const response = await fetch('/api/users/me', {
				method: 'GET',
				credentials: 'include'
			});

			if (response.ok) {
				const userData: User = await response.json();
				set({ isLoggedIn: true, user: userData });
			} else {
				set({ isLoggedIn: false, user: null });
			}
		} catch (error) {
			console.error('Auth check failed:', error);
			set({ isLoggedIn: false, user: null });
		}
	};

	const login = async (username: string, password: string) => {
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});
			if (response.ok) {
				const data = await response.json();
				if (data && data.result) {
					set({ isLoggedIn: true, user: data.result.data as User });
				} else {
					console.error('Login succeeded but response data format was unexpected:', data);
					set({ isLoggedIn: false, user: null });
					throw new Error('Login succeeded but received invalid user data.');
				}
			} else {
				const errorData = await response.json();
				console.error('Login failed:', errorData);
				set({ isLoggedIn: false, user: null });
				throw new Error(`Login failed with status: ${response.status}`);
			}
		} catch (error) {
			console.error('Login request failed:', error);
			set({ isLoggedIn: false, user: null });
			throw new Error('Login request failed');
		}
	};

	const logout = async () => {
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST'
			});

			set({ isLoggedIn: false, user: null });
			invalidateAll();

			if (!response.ok) {
				console.warn(`Server logout failed with status: ${response.status}`);
			}
		} catch (error) {
			console.error('Logout request failed:', error);
			set({ isLoggedIn: false, user: null });
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

		if (response.ok) {
			const data = await response.json();
			if (data && data.result) {
				set({ isLoggedIn: true, user: data.result as User });
			} else {
				console.error('Registration succeeded but response data format was unexpected:', data);
				set({ isLoggedIn: false, user: null });
				throw new Error('Registration succeeded but received invalid user data.');
			}
		} else {
			set({ isLoggedIn: false, user: null });
			throw new Error(`Registration failed with status: ${response.status}`);
		}
	};

	return {
		subscribe,
		checkAuth,
		login,
		logout,
		register
	};
}

export const auth = createAuthStore();
