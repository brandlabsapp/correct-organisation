import { InvoiceForm } from '@/components/finance/invoices/InvoiceForm';

export default function EditInvoicePage({
	params,
}: {
	params: { id: string };
}) {
	return <InvoiceForm invoiceId={params.id} />;
}
