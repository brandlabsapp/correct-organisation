'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { showSuccessToast } from '@/lib/utils/toast-handlers';

const plans = [
	{
		id: 'basic',
		name: 'Basic',
		price: '₹4,999',
		features: ['Basic compliance calendar', 'Document storage', 'Email support'],
	},
	{
		id: 'pro',
		name: 'Professional',
		price: '₹9,999',
		features: ['Advanced AI assistance', 'Custom workflows', 'Priority support'],
	},
	{
		id: 'enterprise',
		name: 'Enterprise',
		price: 'Custom',
		features: ['Dedicated account manager', 'API access', 'Custom integrations'],
	},
];

export function Subscription() {
	const [currentPlan, setCurrentPlan] = useState('basic');

	const handleUpgrade = (planId: string) => {
		// TODO: Implement API call to upgrade subscription
		setCurrentPlan(planId);
		showSuccessToast({
			title: 'Subscription Updated',
			message: `Your subscription has been upgraded to the ${
				plans.find((p) => p.id === planId)?.name
			} plan.`,
		});
	};

	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium'>
				Current Plan: {plans.find((p) => p.id === currentPlan)?.name}
			</h3>
			<div className='grid gap-6 md:grid-cols-3'>
				{plans.map((plan) => (
					<Card
						key={plan.id}
						className={plan.id === currentPlan ? 'border-primary' : ''}
					>
						<CardHeader>
							<CardTitle>{plan.name}</CardTitle>
							<CardDescription>{plan.price}/month</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className='list-disc list-inside space-y-2'>
								{plan.features.map((feature, index) => (
									<li key={index}>{feature}</li>
								))}
							</ul>
						</CardContent>
						<CardFooter>
							<Button
								className='w-full'
								onClick={() => handleUpgrade(plan.id)}
								disabled={plan.id === currentPlan}
							>
								{plan.id === currentPlan ? 'Current Plan' : 'Upgrade'}
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
		</div>
	);
}
