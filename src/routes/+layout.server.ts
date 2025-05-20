import jwt from 'jsonwebtoken';
import { superValidate } from 'sveltekit-superforms';
import { loginFormSchema, registerFormSchema } from '$lib/components/login/formSchema';
import { zod } from 'sveltekit-superforms/adapters';

export async function load({ cookies, depends }) {
	const token = cookies.get('token');
	const user = token ? jwt.decode(token) : null;
	depends('app:auth');
	return {
		user,
		isLoggedIn: user !== null,
		loginForm: await superValidate(zod(loginFormSchema)),
		registerForm: await superValidate(zod(registerFormSchema))
	};
}
