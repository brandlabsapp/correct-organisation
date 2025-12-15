'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { showSuccessToast } from '@/lib/utils/toast-handlers';

interface Notification {
	id: string;
	title: string;
	description: string;
	read: boolean;
}

export function Notifications() {
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: '1',
			title: 'New compliance update',
			description: 'There are new regulations affecting your industry.',
			read: false,
		},
		{
			id: '2',
			title: 'Task due soon',
			description: 'You have a compliance task due in 3 days.',
			read: false,
		},
		{
			id: '3',
			title: 'Document expiring',
			description: 'Your business license is expiring next month.',
			read: true,
		},
	]);

	const [emailNotifications, setEmailNotifications] = useState(true);
	const [pushNotifications, setPushNotifications] = useState(true);

	const markAsRead = (id: string) => {
		setNotifications(
			notifications.map((notif) =>
				notif.id === id ? { ...notif, read: true } : notif
			)
		);
		showSuccessToast({
			title: 'Notification marked as read',
			message: 'The notification has been marked as read.',
		});
	};

	const handleSettingsChange = () => {
		showSuccessToast({
			title: 'Notification settings updated',
			message: 'Your notification preferences have been saved.',
		});
	};

	return (
		<div className='space-y-6 pb-12'>
			<div className='space-y-4'>
				<h3 className='text-lg font-medium'>Notification Settings</h3>
				<div className='flex items-center justify-between'>
					<Label htmlFor='email-notifications'>Email Notifications</Label>
					<Switch
						id='email-notifications'
						checked={emailNotifications}
						onCheckedChange={(checked) => {
							setEmailNotifications(checked);
							handleSettingsChange();
						}}
					/>
				</div>
				<div className='flex items-center justify-between'>
					<Label htmlFor='push-notifications'>Push Notifications</Label>
					<Switch
						id='push-notifications'
						checked={pushNotifications}
						onCheckedChange={(checked) => {
							setPushNotifications(checked);
							handleSettingsChange();
						}}
					/>
				</div>
			</div>
			<div className='space-y-4'>
				<h3 className='text-lg font-medium'>Recent Notifications</h3>
				<ScrollArea className='h-[300px] rounded-md border p-4'>
					{notifications.map((notification) => (
						<div
							key={notification.id}
							className='mb-4 p-4 rounded-lg bg-gray-100 last:mb-0'
						>
							<h4 className='font-medium'>{notification.title}</h4>
							<p className='text-sm text-gray-600 mt-1'>{notification.description}</p>
							{!notification.read && (
								<Button
									variant='link'
									className='mt-2 p-0 h-auto'
									onClick={() => markAsRead(notification.id)}
								>
									Mark as read
								</Button>
							)}
						</div>
					))}
				</ScrollArea>
			</div>
		</div>
	);
}
