interface CachedQuery<T> {
	data: T;
	timestamp: number;
	listeners: Set<(data: T | undefined) => void>; // For direct store-like updates
}

class BaseQueryClient {
	private cache: Map<string, CachedQuery<any>> = new Map();

	getQueryData<T>(key: string): { data: T; timestamp: number } | undefined {
		return this.cache.get(key);
	}

	setQueryData<T>(key: string, data: T) {
		const cached = this.cache.get(key);
		const timestamp = Date.now();
		this.cache.set(key, { data, timestamp, listeners: cached?.listeners || new Set() });
		this.notifyListeners(key, data);
	}

	invalidateQuery(key: string) {
		this.cache.delete(key);
		this.notifyListeners(key, undefined);
	}

	subscribeData<T>(key: string, callback: (data: T | undefined) => void) {
		if (!this.cache.has(key)) {
			this.cache.set(key, { data: undefined, timestamp: 0, listeners: new Set() });
		}
		this.cache.get(key)?.listeners.add(callback);
		return () => {
			this.cache.get(key)?.listeners.delete(callback);
			if (this.cache.get(key)?.listeners.size === 0) {
				this.cache.delete(key);
			}
		};
	}

	private notifyListeners<T>(key: string, data: T | undefined) {
		this.cache.get(key)?.listeners.forEach((listener) => listener(data));
	}
}

export const QueryClient = new BaseQueryClient();
