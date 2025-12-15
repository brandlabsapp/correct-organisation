import { getSecureResource, patchSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const PATCH = async (
	request: Request,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	const id = params.id;
	const body = await request.json();
	const response = await patchSecureResource(`/vault/move-document/${id}`, {
		folderId: body.folderId,
	});
	if (response.state === 'error') {
		return errorHandler(
			response.data,
			'Failed to move document',
			response.status
		);
	}
	return responseWrapper(
		response.data,
		true,
		'Document moved successfully',
		'success'
	);
};
