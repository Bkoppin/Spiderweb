import { z } from 'zod';

export const registerFormSchema = z.object({
	username: z.string().min(2).max(20, {
		message: 'Username must be between 2 and 20 characters'
	}),
	password: z
		.string()
		.min(8, {
			message: 'Password must be at least 8 characters'
		})
		.regex(/(?=.*[0-9])/, {
			message: 'Password must contain at least one number'
		})
		.regex(/(?=.*[a-z])/, {
			message: 'Password must contain at least one lowercase letter'
		})
		.regex(/(?=.*[A-Z])/, {
			message: 'Password must contain at least one uppercase letter'
		})
		.regex(/(?=.*[!@#$%^&*])/, {
			message: 'Password must contain at least one special character'
		})
});

export const loginFormSchema = z.object({
	username: z.string(),
	password: z.string()
});

export type RegisterFormSchema = typeof registerFormSchema;

export type LoginFormSchema = typeof loginFormSchema;
