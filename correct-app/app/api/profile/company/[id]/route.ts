import { getSecureResource, patchSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

// get the company details.
export const GET = async (req: Request, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const id = params.id;
    const response = await getSecureResource(`/company/${id}`);
    if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status);
	}
    return await responseWrapper(response.data, true, 'Success', 'success');
};

export const PATCH = async (req: Request, props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const id = params.id;
    const body = await req.json();
    const response = await patchSecureResource(`/company/${id}`, { ...body });
    if (response.state === 'error') {
		return errorHandler(null, response.message, response.status);
	}
    return responseWrapper(response.data, true, 'Success', 'success');
};
