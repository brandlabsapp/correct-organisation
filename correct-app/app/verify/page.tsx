import VerifyBusinessAndRole from '@/components/verify/VerifyPage';

export default async function Verify(props: {
	searchParams: Promise<{ role: 'consultant' | 'owner' }>;
}) {
	const searchParams = await props.searchParams;
	const role = searchParams.role;
	return <VerifyBusinessAndRole role={role} />;
}
