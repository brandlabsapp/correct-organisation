import { BillDetail } from '@/components/finance/bills/BillDetail';

export default function BillDetailPage({
	params,
}: {
	params: { id: string };
}) {
	return <BillDetail billId={params.id} />;
}
