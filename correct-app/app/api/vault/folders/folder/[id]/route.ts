import {
	deleteSecureResource,
	getSecureResource,
	patchSecureResource,
} from '@/lib/axiosInstance';
import { responseWrapper } from '@/lib/responseWrapper';
import { errorHandler } from '@/lib/errorHandler';

export const GET = async (
	req: Request,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	try {
		const folderId = await params.id;
		const response = await getSecureResource(`/vault/folder/${folderId}`);
		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Folders fetched successfully.',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const PATCH = async (
	req: Request,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	const folderId = params.id;
	const body = await req.json();
	try {
		const response = await patchSecureResource(`/vault/folder/${folderId}`, {
			...body,
		});
		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Folder updated successfully.',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in PATCH handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const DELETE = async (
	req: Request,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	const folderId = params.id;
	try {
		if (!folderId) {
			return errorHandler(null, 'Folder ID is required', 400);
		}
		const response = await deleteSecureResource(
			`/vault/delete-folder/${folderId}`
		);
		if (response.state === 'error') {
			console.error('Error deleting folder:', response.message);
			return errorHandler(null, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Folder deleted successfully.',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in DELETE handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
