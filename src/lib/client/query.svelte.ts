import { QueryClient } from './queryClient';

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
	readonly isError: boolean;
	readonly error: Error | null;
	refetch: () => void;
	invalidate: () => void;
};

type FetchStatus = 'idle' | 'fetching' | 'success' | 'error';

export function useQuery<T>(key: string, options: QueryOptions<T>): QueryState<T> {
	const { queryFn, enabled = true, staleTime = 0, onSuccess, onError } = options;

	let data = $state<T | undefined>(undefined);
	let isLoading = $state(false);
	let isError = $state(false);
	let error = $state<Error | null>(null);
	let fetchStatus = $state<FetchStatus>('idle');
	let unsubscribe: void | (() => void);

	const initialCachedState = QueryClient.getQueryData<T>(key);
	const initialDataIsFresh =
		initialCachedState &&
		(staleTime === 0 || Date.now() - (initialCachedState.timestamp || 0) <= staleTime);

	if (enabled && initialDataIsFresh) {
		data = initialCachedState.data;
		fetchStatus = 'success';
		isLoading = false;
	} else if (enabled) {
		isLoading = !initialCachedState?.data;
		fetchStatus = 'idle';
	} else {
		fetchStatus = 'idle';
		isLoading = false;
	}

	const fetchData = async () => {
		if (fetchStatus === 'fetching' || !enabled) return;

		isLoading = true;
		isError = false;
		error = null;
		fetchStatus = 'fetching';

		try {
			const result = await queryFn();
			QueryClient.setQueryData(key, result);
			onSuccess?.(result);
		} catch (err) {
			error = err as Error;
			isError = true;
			isLoading = false;
			fetchStatus = 'error';
			onError?.(err as Error);
		}
	};

	const invalidate = () => {
		QueryClient.invalidateQuery(key);
		fetchStatus = 'idle';
		isLoading = !QueryClient.getQueryData(key)?.data;
		isError = false;
		error = null;
	};

	const refetch = async () => {
		if (fetchStatus !== 'fetching') {
			await fetchData();
		}
	};

	$effect(() => {
		let needsFetch = false;

		if (enabled) {
			const currentCachedState = QueryClient.getQueryData<T>(key);
			const cacheIsStale =
				!currentCachedState ||
				(staleTime > 0 && Date.now() - (currentCachedState.timestamp || 0) > staleTime);

			if (fetchStatus === 'idle' && cacheIsStale) {
				needsFetch = true;
			} else if (fetchStatus === 'success' && cacheIsStale && staleTime > 0) {
				needsFetch = true;
			} else {
				needsFetch = false;
				if (fetchStatus !== 'fetching') {
					if (!cacheIsStale || fetchStatus === 'error') {
						if (isLoading) isLoading = false;
					}
					if (!cacheIsStale && currentCachedState && data !== currentCachedState.data) {
						data = currentCachedState.data;
						if (fetchStatus !== 'success' && fetchStatus !== 'error') fetchStatus = 'success';
					}
				}
			}

			if (!unsubscribe) {
				unsubscribe = QueryClient.subscribeData<T>(key, (newData) => {
					const currentStatus = fetchStatus;

					data = newData;

					if (currentStatus === 'fetching') {
						isLoading = false;
						fetchStatus = 'success';
						isError = false;
						error = null;
					} else if (newData === undefined && data !== undefined) {
						fetchStatus = 'idle';
					}
				});
			}
		} else {
			needsFetch = false;
			if (isLoading) isLoading = false;
			if (fetchStatus !== 'idle') fetchStatus = 'idle';
			if (unsubscribe) {
				unsubscribe();
				unsubscribe = undefined;
			}
		}

		if (needsFetch && fetchStatus !== 'fetching' && fetchStatus !== 'error') {
			fetchData();
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
			return data;
		},
		get isLoading() {
			return isLoading;
		},
		get isError() {
			return isError;
		},
		get error() {
			return error;
		},
		refetch,
		invalidate
	};
}
