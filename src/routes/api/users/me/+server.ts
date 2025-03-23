import type { Cookies } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

const getMe = async ({ request, cookies }: { request: Request; cookies: Cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		return new Response(JSON.stringify(decoded), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
	}
};

export { getMe as GET };
