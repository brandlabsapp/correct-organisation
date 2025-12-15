import Markdown from '@/components/common/Markdown';
import { termsAndConditions } from '@/data/static/legal';

export default function TermsAndConditions() {
	return <Markdown content={termsAndConditions} />;
}
