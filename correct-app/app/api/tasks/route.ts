import { NextRequest, NextResponse } from 'next/server';
import { getSecureResource, postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const GET = async (request: NextRequest) => {
	try {
		const { searchParams } = new URL(request.url);
		const id = searchParams.get('id');

		if (id) {
			const task = await getSecureResource(`compliance/tasks/${id}`);

			if (task.state === 'error') {
				return errorHandler(null, task.message, task.status);
			}

			return responseWrapper(
				task.data,
				true,
				'Task fetched successfully',
				'success'
			);
		} else {
			// Get all tasks
			const tasks = await getSecureResource('/compliance/tasks');

			if (tasks.state === 'error') {
				return errorHandler(null, tasks.message, tasks.status);
			}

			return responseWrapper(
				tasks.data,
				true,
				'Tasks fetched successfully',
				'success'
			);
		}
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const POST = async (request: NextRequest) => {
	try {
		const body = await request.json();

		const response = await postSecureResource('/compliance/tasks', body);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(
			response.data,
			true,
			'Task created successfully',
			'success'
		);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
