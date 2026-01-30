import { BillForm } from '@/components/finance/bills/BillForm';

export default function EditBillPage({
	params,
}: {
	params: { id: string };
}) {
	return <BillForm billId={params.id} />;
}
