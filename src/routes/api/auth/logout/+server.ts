import { type Cookies } from '@sveltejs/kit';
import { HttpStatusCodes } from '$lib/shared/http/enums';

const logout = async ({ cookies }: { cookies: Cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		return new Response(
			JSON.stringify({
				isSuccessful: false,
				message: 'Not logged in',
				statusCode: HttpStatusCodes.BAD_REQUEST
			}),
			{
				status: HttpStatusCodes.UNAUTHORIZED
			}
		);
	}

	cookies.delete('token', { path: '/' });
	return new Response(
		JSON.stringify({
			isSuccessful: true,
			statusCode: HttpStatusCodes.OK,
			message: 'Successfully logged out'
		}),
		{ status: HttpStatusCodes.OK }
	);
};

export { logout as POST };
