import { Card, CardContent } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function TeamMembersList({
	teamMembers,
	handleEdit,
}: {
	teamMembers: any;
	handleEdit: (id: number, updatedData: { [key: string]: string }) => void;
}) {
	return (
		<div className='block md:hidden space-y-4 mt-6 max-h-[500px] overflow-y-auto scrollbar-hide p-5 bg-white'>
			{teamMembers.map((member: any) => (
				<Card key={member.id} className='border border-border bg-lightgray'>
					<CardContent className='p-4'>
						<div className='flex justify-between items-center mb-4'>
							<span className='font-medium'>{member.user?.name || member.name}</span>
						</div>
						<div className='grid grid-cols-4 space-y-2 text-xs'>
							<div className='text-muted-foreground'>Phone</div>
							<div className='col-span-3'>{member.user?.phone || member.phone}</div>
							<div className='text-muted-foreground'>Role</div>
							<div className='col-span-3'>
								<Select
									value={member.role}
									onValueChange={(value) => handleEdit(member.id, { role: value })}
								>
									<SelectTrigger className='h-8'>
										<SelectValue>{member.role}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='admin'>Admin</SelectItem>
										<SelectItem value='member'>Member</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className='text-muted-foreground'>Status</div>
							<div className='col-span-3'>
								<span
									className={`capitalize ${
										member.status === 'pending'
											? 'bg-yellow-100 text-yellow-600'
											: 'bg-green-100 text-green-600'
									}`}
								>
									{member.status}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
