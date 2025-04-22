export const GET = async ({ request }: { request: Request }) => {
	return new Response(JSON.stringify({ id: Math.floor(Math.random() * 1000), name: 'Test' }), {
		status: 200
	});
};
