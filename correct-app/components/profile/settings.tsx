'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { showSuccessToast } from '@/lib/utils/toast-handlers';

export function Settings() {
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [pushNotifications, setPushNotifications] = useState(true);
	const [language, setLanguage] = useState('english');

	const handleSaveSettings = () => {
		// TODO: Implement API call to save settings
		showSuccessToast({
			title: 'Settings Saved',
			message: 'Your settings have been successfully updated.',
		});
	};

	return (
		<div className='space-y-6 p-1'>
			<div className='space-y-4'>
				<h3 className='text-sm md:text-lg font-medium'>Language</h3>
				<Select value={language} onValueChange={setLanguage}>
					<SelectTrigger>
						<SelectValue placeholder='Select Language' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='english'>English</SelectItem>
						<SelectItem value='hindi'>Hindi</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<Button onClick={handleSaveSettings} className='w-full text-sm md:w-auto'>
				Save Settings
			</Button>
		</div>
	);
}
