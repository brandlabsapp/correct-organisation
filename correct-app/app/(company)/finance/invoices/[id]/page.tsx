import { InvoiceDetail } from '@/components/finance/invoices/InvoiceDetail';

export default function InvoiceDetailPage({
	params,
}: {
	params: { id: string };
}) {
	return <InvoiceDetail invoiceId={params.id} />;
}
