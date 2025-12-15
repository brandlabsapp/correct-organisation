import {
	deleteSecureResource,
	getSecureResource,
	patchSecureResource,
} from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const DELETE = async (
	request: Request,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	try {
		const id = params.id;
		const response = await deleteSecureResource(`/vault/delete-document/${id}`);
		if (response.state === 'error') {
			return errorHandler(
				response.data,
				'Document deleted successfully',
				response.status
			);
		}
		return responseWrapper(
			response.data,
			true,
			'Document deleted successfully',
			'success'
		);
	} catch (error) {
		console.error('Unhandled error in DELETE handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const GET = async (
	request: Request,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	const id = params.id;
	const response = await getSecureResource(`/vault/get-document/${id}`);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status);
	}
	return responseWrapper(response.data, true, response.message, response.state);
};

export const PATCH = async (
	request: Request,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	const id = params.id;
	const body = await request.json();
	const response = await patchSecureResource(
		`/vault/update-document/${id}`,
		body
	);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status);
	}
	return responseWrapper(response.data, true, response.message, response.state);
};
