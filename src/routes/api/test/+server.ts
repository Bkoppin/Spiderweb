import { UserHTTP } from '$lib/server/http/consumers/user';
import { WorldHTTP } from '$lib/server/http/consumers/world';

const testData = [
	{
		id: 1,
		name: 'Test 1'
	}
];

export const GET = async ({ request }: { request: Request }) => {
	const worlds = await UserHTTP.getWorlds(68);
	if (worlds.result?.data === undefined) {
		return new Response(JSON.stringify({ error: 'No worlds found' }), {
			status: 404
		});
	}
	return new Response(JSON.stringify(worlds), {
		status: 200
	});
};

export const PUT = async ({ request }: { request: Request }) => {
	const body = await request.json();
	const { id, name } = body;
	const newTest = {
		id,
		name
	};

	const data = testData.find((item) => item.id === id);
	if (data) {
		data.name = name;
	} else {
		testData.push(newTest);
	}

	return new Response(JSON.stringify(data), {
		status: 200
	});
};

export const POST = async ({ request }: { request: Request }) => {
	const body = await request.json();
	const { id, name } = body;
	const newTest = {
		id,
		name
	};

	testData.push(newTest);

	return new Response(JSON.stringify(newTest), {
		status: 200
	});
};

export const DELETE = async ({ request }: { request: Request }) => {
	const body = await request.json();
	const { id } = body;
	try {
		const deleted = await WorldHTTP.removeWorld(id);
		if (deleted.isSuccessful === false) {
			throw new Error(deleted.message ?? 'Unknown error occurred');
		}
		return new Response(JSON.stringify(deleted.result?.data), {
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error deleting test' }), {
			status: 500
		});
	}
};
