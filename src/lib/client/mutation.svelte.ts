import { getContext } from 'svelte';
import type { QueryClient } from './queryClient';

type MutationArgs = any[];

type MutationResult<T> = T | undefined;

type MutationFunction<T> = (...args: MutationArgs) => Promise<MutationResult<T>>;

interface MutationOptions<T> {
	mutationFn: MutationFunction<T>;
	onSuccess?: (data: T | undefined, variables: MutationArgs) => void;
	onError?: (error: Error, variables: MutationArgs) => void;
	invalidateKeys?: string | string[];
}

type MutationState<T> = {
	readonly data: MutationResult<T>;
	readonly isLoading: boolean;
	readonly isError: boolean;
	readonly error: Error | null;
	readonly status: 'idle' | 'loading' | 'success' | 'error';
	mutate: (...args: MutationArgs) => Promise<void>;
	reset: () => void;
};

type MutationInternalStatus = 'idle' | 'loading' | 'success' | 'error';

export function useMutation<T>(options: MutationOptions<T>): MutationState<T> {
	const { mutationFn, onSuccess, onError, invalidateKeys } = options;

	let data = $state<MutationResult<T>>(undefined);
	let isLoading = $state(false);
	let isError = $state(false);
	let error = $state<Error | null>(null);
	let mutationStatus = $state<MutationInternalStatus>('idle');

	const QueryClient = getContext<QueryClient>('queryClient');
	if (!QueryClient) {
		throw new Error('QueryClient not found in context. Did you use QueryClientProvider?');
	}

	const mutate = async (...args: MutationArgs) => {
		if (isLoading) {
			return;
		}

		isLoading = true;
		isError = false;
		error = null;
		mutationStatus = 'loading';

		try {
			const result = await mutationFn(...args);

			data = result;
			mutationStatus = 'success';
			isLoading = false;
			isError = false;
			error = null;

			if (onSuccess) {
				try {
					onSuccess(result, args);
				} catch (e) {}
			}

			if (invalidateKeys) {
				const keysToInvalidate = Array.isArray(invalidateKeys) ? invalidateKeys : [invalidateKeys];
				keysToInvalidate.forEach((key) => {
					QueryClient.invalidateQuery(key);
				});
			}
		} catch (err) {
			const errorResult = err as Error;

			error = errorResult;
			mutationStatus = 'error';
			isLoading = false;
			isError = true;

			if (onError) {
				try {
					onError(errorResult, args);
				} catch (e) {}
			}
		}
	};

	const reset = () => {
		data = undefined;
		isLoading = false;
		isError = false;
		error = null;
		mutationStatus = 'idle';
	};

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
		get status() {
			return mutationStatus;
		},
		mutate,
		reset
	};
}
