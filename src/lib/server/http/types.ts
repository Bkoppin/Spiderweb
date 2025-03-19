export type BaseHTTPResponse<T> = {
	isSuccessful: boolean;
	message?: string | null;
	result?: T;
	statusCode: number;
};
