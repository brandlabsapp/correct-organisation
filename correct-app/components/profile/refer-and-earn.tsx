'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showSuccessToast } from '@/lib/utils/toast-handlers'

export function ReferAndEarn() {
	const [referralCode, setReferralCode] = useState('ABC123');
	const [referralLink, setReferralLink] = useState(
		'https://complianceai.com/refer/ABC123'
	);

	const handleCopyCode = () => {
		navigator.clipboard.writeText(referralCode);
		showSuccessToast({
			title: 'Referral Code Copied',
			message: 'The referral code has been copied to your clipboard.',
		});
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(referralLink);
		showSuccessToast({
			title: 'Referral Link Copied',
			message: 'The referral link has been copied to your clipboard.',
		});
	};

	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium'>Refer a Friend and Earn Rewards</h3>
			<p>
				Share your referral code or link with friends and earn rewards when they
				sign up!
			</p>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='referralCode'>Your Referral Code</Label>
					<div className='flex space-x-2'>
						<Input id='referralCode' value={referralCode} readOnly />
						<Button onClick={handleCopyCode}>Copy Code</Button>
					</div>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='referralLink'>Your Referral Link</Label>
					<div className='flex space-x-2'>
						<Input id='referralLink' value={referralLink} readOnly />
						<Button onClick={handleCopyLink}>Copy Link</Button>
					</div>
				</div>
			</div>
			<div>
				<h4 className='font-medium mb-2'>How it works:</h4>
				<ol className='list-decimal list-inside space-y-1'>
					<li>Share your referral code or link with friends</li>
					<li>They sign up using your code</li>
					<li>You both receive rewards once they subscribe</li>
				</ol>
			</div>
		</div>
	);
}
