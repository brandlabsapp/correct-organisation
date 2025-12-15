import Markdown from '@/components/common/Markdown';
import { privacyPolicy } from '@/data/static/legal';

export default function PrivacyPolicy() {
	return <Markdown content={privacyPolicy} />;
}
