interface CachedQuery<T> {
	data?: T;
	timestamp: number;
	error: Error | null;
	listeners: Set<(data: T | undefined) => void>;
}

export interface QueryClient {
	getQueryData<T>(key: string): CachedQuery<T> | undefined;
	setQueryData<T>(key: string, data: T | undefined, error?: Error | null): void;
	invalidateQuery(key: string): void;
	subscribeData<T>(key: string, callback: (data: T | undefined) => void): () => void;
}

export type CachedQueryState<T> = {
	data?: T;
	timestamp?: number;
	error?: Error | null;
};

class BaseQueryClient implements QueryClient {
	private cache: Map<string, CachedQuery<any>> = new Map();

	getQueryData<T>(key: string): CachedQuery<T> | undefined {
		return this.cache.get(key);
	}

	setQueryData<T>(key: string, data: T | undefined, error: Error | null = null) {
		const timestamp = Date.now();
		const existingEntry = this.cache.get(key);
		const listeners = existingEntry?.listeners || new Set();
		const newState: CachedQuery<T> = { data, timestamp, error, listeners };
		this.cache.set(key, newState);
		this.notifyListeners(key, data);
	}

	invalidateQuery(key: string): void {
		const entry = this.cache.get(key);
		const existed = this.cache.delete(key);
		if (existed && (entry?.listeners?.size ?? 0) > 0) {
			this.notifyListeners(key, undefined);
		}
	}

	subscribeData<T>(key: string, callback: (data: T | undefined) => void): () => void {
		let entry = this.cache.get(key);
		if (!entry) {
			entry = { timestamp: 0, listeners: new Set(), error: null, data: undefined };
			this.cache.set(key, entry);
		}
		entry.listeners = entry.listeners || new Set();
		entry.listeners.add(callback);
		return () => {
			const currentEntry = this.cache.get(key);
			if (currentEntry) {
				currentEntry.listeners.delete(callback);
			}
		};
	}

	private notifyListeners<T>(key: string, data: T | undefined) {
		const entry = this.cache.get(key);
		if (entry?.listeners && entry.listeners.size > 0) {
			const listenersToNotify = Array.from(entry.listeners);
			listenersToNotify.forEach((listener) => {
				try {
					listener(data);
				} catch (e) {
					console.error(`Error notifying listener for key ${key}:`, e);
				}
			});
		}
	}
}

export const QueryClient = new BaseQueryClient();
