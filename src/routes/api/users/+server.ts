import { UserHTTP } from '$lib/server/http/consumers/user';
import { HttpStatusCodes } from '$lib/shared/http/enums';
import type { Cookies } from '@sveltejs/kit';

const register = async ({ request, cookies }: { request: Request; cookies: Cookies }) => {
	const { username, password } = await request.json();

	if (!username || !password) {
		return new Response(
			JSON.stringify(
				UserHTTP.getErrorResponse({
					error: 'Invalid Credentials',
					statusCode: HttpStatusCodes.NOT_FOUND
				})
			),
			{
				status: HttpStatusCodes.NOT_FOUND
			}
		);
	}

	const response = await UserHTTP.register(username, password, cookies);

	return new Response(JSON.stringify(response), {
		status: response.statusCode
	});
};

export { register as POST };
