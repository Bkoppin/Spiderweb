import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	userID: z.number(),
	username: z.string(),
	worlds: z.lazy(() => worldSchema.array()).optional()
});

export type User = z.infer<typeof userSchema>;

export const worldSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.string(),
	continents: z.lazy(() => continentSchema.array()).optional(),
	oceans: z.lazy(() => oceanSchema.array()).optional()
});

export type World = z.infer<typeof worldSchema>;

export const continentSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.string(),
	zones: z.lazy(() => zoneSchema.array()).optional()
});

export type Continent = z.infer<typeof continentSchema>;

export const oceanSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string()
});

export type Ocean = z.infer<typeof oceanSchema>;

export const zoneSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.string(),
	locations: z.lazy(() => locationSchema.array()).optional(),
	cities: z.lazy(() => citySchema.array()).optional()
});

export type Zone = z.infer<typeof zoneSchema>;

export const locationSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.string()
});

export type Location = z.infer<typeof locationSchema>;

export const citySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	type: z.string(),
	capital: z.boolean()
});

export type City = z.infer<typeof citySchema>;
