export type BaseHTTPResponse<T> = {
	isSuccessful: boolean;
	message?: string | null;
	result?: {
		data: T;
	};
	statusCode: number;
};

export interface BaseUser {
	id?: string | number;
	username: string;
}

export interface User extends BaseUser {
	userID: number;
	worlds?: World[];
}
export type World = {
	id?: string;
	name: string;
	description: string;
	type: string;
	continents?: Continent[];
	oceans?: Ocean[];
};

export type Continent = {
	id?: string;
	name: string;
	description: string;
	type: string;
	zones?: Zone[];
};

export type Ocean = {
	id?: string;
	name: string;
	description: string;
};

export type Zone = {
	id?: string;
	name: string;
	description: string;
	type: string;
	locations?: Location[];
	cities?: City[];
};

export type Location = {
	id?: string;
	name: string;
	description: string;
	type: string;
};

export type City = {
	id?: string;
	name: string;
	description: string;
	type: string;
	capital: boolean;
};
