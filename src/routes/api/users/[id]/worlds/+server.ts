import { UserHTTP } from '$lib/server/http/consumers/user';

const getWorlds = async ({ params }: { params: { id: number } }) => {
	const userId = params.id;
	const res = await UserHTTP.getWorlds(userId);

	if (res.statusCode === 200) {
		return new Response(JSON.stringify(res.result), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} else {
		return new Response(JSON.stringify({ error: 'Failed to fetch worlds' }), {
			status: res.statusCode,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
};

export { getWorlds as GET };
