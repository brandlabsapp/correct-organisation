import { EstimateForm } from '@/components/finance/estimates/EstimateForm';

export default function EditEstimatePage({
	params,
}: {
	params: { id: string };
}) {
	return <EstimateForm estimateId={params.id} />;
}
