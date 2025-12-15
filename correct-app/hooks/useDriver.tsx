import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/driver.css';

export const driverObj = driver({
	showProgress: true,
	steps: [
		{
			element: '#home',
			popover: {
				title: 'Welcome to Home',
				description:
					"Your app's starting point! View insights and get an overview of your activities here 🏠",
				side: 'left',
				align: 'start',
			},
		},
		{
			element: '#learn',
			popover: {
				title: 'Learn',
				description:
					'Learn about the latest compliance trends and regulations. Everything you need, all in one place! 📂',
				side: 'bottom',
				align: 'start',
			},
		},
		{
			element: '#vault',
			popover: {
				title: 'Explore the Vault',
				description:
					'Store and manage your important files securely. Everything you need, all in one place! 📂',
				side: 'bottom',
				align: 'start',
			},
		},
		{
			element: '#chat',
			popover: {
				title: 'Chat with Ease',
				description:
					'Connect with your team or friends instantly. Share updates, ideas, and have fun conversations! 🗨️',
				side: 'bottom',
				align: 'start',
			},
		},
		{
			element: '#profile',
			popover: {
				title: 'Personalize Your Profile',
				description:
					'Make this app truly yours by customizing your profile. Add your details and preferences here! ✨',
				side: 'bottom',
				align: 'start',
			},
		},
	],
});
