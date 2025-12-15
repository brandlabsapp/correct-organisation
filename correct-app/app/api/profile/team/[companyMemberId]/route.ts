import { deleteSecureResource } from '@/lib/axiosInstance';
import { responseWrapper } from '@/lib/responseWrapper';
import { errorHandler } from '@/lib/errorHandler';

export async function DELETE(
	request: Request,
	props: { params: Promise<{ companyMemberId: string }> }
) {
	const params = await props.params;
	try {
		const companyMemberId = params.companyMemberId;
		const response = await deleteSecureResource(
			`/company-members/${companyMemberId}`
		);
		if (response.state !== 'success') {
			return errorHandler(response.data, response.message, response.status);
		}

		return responseWrapper(response.data, true, 'Success', 'success');
	} catch (error: any) {
		return errorHandler(null, 'Failed to send OTP', 500);
	}
}
