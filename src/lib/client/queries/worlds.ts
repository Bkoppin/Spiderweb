import { z } from 'zod';
import { worldSchema } from '$lib/shared/models';

export async function getUserWorlds(id: number) {
	const response = await fetch(`/api/users/${id}/worlds`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (response.status === 404) {
		console.warn(`No worlds found for user with ID ${id}`);
		return [];
	}
	const data = await response.json();

	const parsedData = z.array(worldSchema).safeParse(data);

	if (!parsedData.success) {
		console.error('Failed to parse worlds data:', parsedData.error);
		throw new Error('Invalid data format');
	}

	return parsedData.data;
}
