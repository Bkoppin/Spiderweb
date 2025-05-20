import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginFormSchema } from '$lib/components/login/formSchema';
import { UserHTTP } from '$lib/server/http/consumers/user.js';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;
		const response = await UserHTTP.login(username, password, event.cookies);

		if (response.isSuccessful !== false) {
			return { sucess: true };
		} else {
			return fail(400, { form });
		}
	}
};
