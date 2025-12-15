import { patchPublicResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const PATCH = async (req: Request, props: { params: Promise<{ memberId: string }> }) => {
    const params = await props.params;
    try {
		const { memberId } = params;
		const { role, name, userId } = await req.json();

		if (!memberId || !userId) {
			return errorHandler(null, 'Member ID and User ID are required', 400);
		}

		const updatedMember = await patchPublicResource(
			`/admin/company/members/${memberId}`,
			{
				role,
				name,
				userId,
			}
		);

		if (updatedMember.state === 'error') {
			return errorHandler(null, updatedMember.message, updatedMember.status);
		}

		return responseWrapper(
			updatedMember.data,
			true,
			'Member updated successfully',
			'success'
		);
	} catch (error) {
		console.error('Unhandled error in PATCH handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
