import { EstimateDetail } from '@/components/finance/estimates/EstimateDetail';

export default function EstimateDetailPage({
	params,
}: {
	params: { id: string };
}) {
	return <EstimateDetail estimateId={params.id} />;
}
