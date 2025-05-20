import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerFormSchema } from '$lib/components/login/formSchema';
import { UserHTTP } from '$lib/server/http/consumers/user.js';

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;
		const response = await UserHTTP.register(username, password, event.cookies);

		if (response.isSuccessful !== false) {
			return { success: true };
		} else {
			return fail(response.statusCode, { form });
		}
	}
};
