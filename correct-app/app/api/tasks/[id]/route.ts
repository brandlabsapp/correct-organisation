import { NextRequest } from 'next/server';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { putSecureResource, deleteSecureResource } from '@/lib/axiosInstance';

export const PUT = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params;

		if (!id) {
			return errorHandler(null, 'Task ID is required', 400);
		}

		const body = await request.json();

		const response = await putSecureResource(`/compliance/tasks/${id}`, body);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(
			response.data,
			true,
			'Task updated successfully',
			'success'
		);
	} catch (error) {
		console.error('Unhandled error in PUT handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const DELETE = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const { id } = await params;

		if (!id) {
			return errorHandler(null, 'Task ID is required', 400);
		}

		const response = await deleteSecureResource(`/compliance/tasks/${id}`);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(
			response.data,
			true,
			'Task deleted successfully',
			'success'
		);
	} catch (error) {
		console.error('Unhandled error in DELETE handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
