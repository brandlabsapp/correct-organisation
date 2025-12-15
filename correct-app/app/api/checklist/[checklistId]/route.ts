import {
	patchSecureResource,
	deleteSecureResource,
	getSecureResource,
} from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';

import { responseWrapper } from '@/lib/responseWrapper';

export const PATCH = async (
	req: Request,
	props: { params: Promise<{ checklistId: string }> }
) => {
	const params = await props.params;
	try {
		const { checklistId } = params;

		const body = await req.json();

		const response = await patchSecureResource(
			`/checklist/update-checklist/${checklistId}`,
			{
				...body,
			}
		);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in PATCH handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const DELETE = async (
	req: Request,
	props: { params: Promise<{ checklistId: string }> }
) => {
	const params = await props.params;
	try {
		const { checklistId } = params;
		const response = await deleteSecureResource(
			`/checklist/delete-checklist/${checklistId}`
		);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in DELETE handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const GET = async (
	req: Request,
	props: { params: Promise<{ checklistId: string }> }
) => {
	const params = await props.params;
	const { checklistId } = params;

	if (!checklistId) {
		return responseWrapper(null, false, 'Checklist ID is required', 'error');
	}

	const response = await getSecureResource(`/checklist/${checklistId}`);

	if (response.state === 'error') {
		return responseWrapper(null, false, response.message, response.state);
	}

	return responseWrapper(response.data, true, response.message, response.state);
};
