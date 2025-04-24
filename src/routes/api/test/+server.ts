const testData = [
	{
		id: 1,
		name: 'Test 1'
	}
];

export const GET = async ({ request }: { request: Request }) => {
	return new Response(JSON.stringify(testData), {
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

	const index = testData.findIndex((item) => item.id === id);
	if (index !== -1) {
		testData.splice(index, 1);
	}

	return new Response(JSON.stringify({ message: 'Deleted' }), {
		status: 200
	});
};
