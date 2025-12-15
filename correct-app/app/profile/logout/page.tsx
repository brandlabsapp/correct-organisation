import { LogoutButton } from '@/components/profile/logout-button';

export default function LogoutPage() {
	return (
		<div className='py-4'>
			<h2 className='text-xl font-semibold mb-4'>Logout</h2>
			<p className='text-muted-foreground mb-6'>
				Are you sure you want to sign out from Correct?
			</p>
			<LogoutButton />
		</div>
	);
}
