import { getSecureResource } from '@/lib/axiosInstance';
import { responseWrapper } from '@/lib/responseWrapper';

export const GET = async (
	req: Request,
	props: { params: Promise<{ companyId: string }> }
) => {
	const params = await props.params;
	const { companyId } = params;
	const { searchParams } = new URL(req.url);
	const checklistId = searchParams.get('checklistId');

	if (!companyId) {
		return responseWrapper(null, false, 'Company ID is required', 'error');
	}

	let url = `/checklist/company-checklist/${companyId}`;
	if (checklistId) {
		url += `?checklistId=${checklistId}`;
	}

	const response = await getSecureResource(url);

	if (response.state === 'error') {
		return responseWrapper(null, false, response.message, response.state);
	}

	return responseWrapper(response.data, true, response.message, response.state);
};
