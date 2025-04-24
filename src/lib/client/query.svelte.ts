import { QueryClient, type CachedQueryState } from './queryClient';
import { getContext } from 'svelte';

interface QueryOptions<T> {
	queryFn: () => Promise<T>;
	enabled?: boolean;
	staleTime?: number;
	onSuccess?: (data: T) => void;
	onError?: (error: Error) => void;
}

type QueryState<T> = {
	readonly data: T | undefined;
	readonly isLoading: boolean;
	readonly isFetching: boolean;
	readonly isError: boolean;
	readonly error: Error | null;
	readonly status: 'loading' | 'error' | 'success' | 'idle';
	refetch: () => Promise<void>;
	invalidate: () => void;
};

type FetchStatus = 'idle' | 'fetching' | 'paused';

function isCacheFresh<T>(cachedState: CachedQueryState<T> | undefined, staleTime: number): boolean {
	if (!cachedState?.data || cachedState?.error) return false;
	if (staleTime <= 0) return false;
	const now = Date.now();
	const cacheTimestamp = cachedState.timestamp || 0;
	return now - cacheTimestamp <= staleTime;
}

function getDerivedState<T>(
	cachedState: CachedQueryState<T> | undefined,
	options: { enabled: boolean; staleTime: number }
): {
	data: T | undefined;
	status: 'success' | 'error' | 'idle';
	error: Error | null;
	isStale: boolean;
} {
	const { enabled, staleTime } = options;
	const data = cachedState?.data;
	const error = cachedState?.error || null;

	if (!enabled) {
		const status = error ? 'error' : data !== undefined ? 'success' : 'idle';
		return { data, error, isStale: false, status };
	}
	if (error) {
		return { data, error, isStale: false, status: 'error' };
	}
	if (data !== undefined) {
		const isFresh = isCacheFresh(cachedState, staleTime);
		return { data, error: null, isStale: !isFresh, status: 'success' };
	}
	return { data: undefined, error: null, isStale: true, status: 'idle' };
}

function getPublicStatus(
	fetchStatus: FetchStatus,
	localData: unknown | undefined,
	localError: Error | null
): 'loading' | 'error' | 'success' | 'idle' {
	if (fetchStatus === 'fetching') return 'loading';
	if (localError) return 'error';
	if (localData !== undefined) return 'success';
	return 'idle';
}

export function useQuery<T>(key: string, options: QueryOptions<T>): QueryState<T> {
	const { queryFn, enabled = true, staleTime = 0, onSuccess, onError } = options;

	let localData = $state<T | undefined>(undefined);
	let localError = $state<Error | null>(null);
	let fetchStatus = $state<FetchStatus>('idle');
	let unsubscribe: (() => void) | undefined = undefined;

	const QueryClient = getContext<QueryClient>('queryClient');
	if (!QueryClient) {
		throw new Error('QueryClient not found in context. Did you use QueryClientProvider?');
	}

	const fetchData = async () => {
		if (fetchStatus === 'fetching' || !enabled) return;
		fetchStatus = 'fetching';
		localError = null;
		try {
			const res = await queryFn();
			QueryClient.setQueryData(key, res, null);
			localData = res;
			localError = null;
			fetchStatus = 'paused';
			onSuccess?.(res);
		} catch (err) {
			const error = err as Error;
			localError = error;
			const currentCachedState = QueryClient.getQueryData<T>(key);
			QueryClient.setQueryData(key, currentCachedState?.data as T, error);
			fetchStatus = 'idle';
			onError?.(error);
		}
	};

	const invalidate = () => {
		QueryClient.invalidateQuery(key);
		if (fetchStatus !== 'fetching') {
			fetchStatus = 'idle';
		}
	};

	const refetch = async () => {
		if (fetchStatus === 'paused') {
			fetchStatus = 'idle';
		}
	};

	$effect(() => {
		const cachedState = QueryClient.getQueryData<T>(key);
		const derived = getDerivedState(cachedState, { enabled, staleTime });
		let needsFetch = false;
		const currentEffectFetchStatus = fetchStatus;

		if (currentEffectFetchStatus !== 'fetching') {
			let syncDataFromCache = true;
			if (currentEffectFetchStatus === 'paused') {
				syncDataFromCache = false;
			} else if (derived.data === undefined && localData !== undefined) {
				syncDataFromCache = false;
			}

			localError = derived.error;

			if (syncDataFromCache) {
				localData = derived.data;
			}

			const isStale = enabled && derived.isStale;
			needsFetch = isStale && currentEffectFetchStatus !== 'paused' && derived.status !== 'error';

			let nextStatus: FetchStatus = 'idle';
			if (enabled && !needsFetch && localError === null) {
				nextStatus = 'paused';
			}

			if (fetchStatus !== nextStatus) {
				fetchStatus = nextStatus;
			}
		}

		if (needsFetch && fetchStatus === 'idle') {
			const latestCache = QueryClient.getQueryData<T>(key);
			if (!latestCache?.error) {
				fetchData();
			} else {
				localError = latestCache.error;
				if (fetchStatus !== 'idle') fetchStatus = 'idle';
			}
		}

		if (enabled && !unsubscribe) {
			unsubscribe = QueryClient.subscribeData<T>(key, () => {});
		}
		if (!enabled && unsubscribe) {
			unsubscribe();
			unsubscribe = undefined;
		}

		return () => {
			if (unsubscribe) {
				unsubscribe();
				unsubscribe = undefined;
			}
		};
	});

	return {
		get data() {
			return localData;
		},
		get isLoading() {
			return fetchStatus === 'fetching';
		},
		get isFetching() {
			return fetchStatus === 'fetching';
		},
		get isError() {
			return localError !== null;
		},
		get error() {
			return localError;
		},
		get status() {
			return getPublicStatus(fetchStatus, localData, localError);
		},
		refetch,
		invalidate
	};
}
