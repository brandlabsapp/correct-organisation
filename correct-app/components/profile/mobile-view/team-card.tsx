import React from 'react';
// Replaced moment with date-fns for smaller bundle size
import { format } from 'date-fns';

type Props = {
	member: any;
};

export const TeamCard = ({ member }: Props) => {
	return (
		<div className='px-6 py-4 border-b flex flex-col gap-6'>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<p className='text-body3'>Created at</p>
					<p className='text-body3 font-medium text-secondarygray-light'>
						{format(new Date(member.createdAt), 'dd MMM yyyy')} {/* date-fns format */}
					</p>
				</div>
				<div>
					<p className='text-body3'>Role</p>
					<p className='text-body3 font-medium text-secondarygray-light'>
						{member.role || 'Not specified'}
					</p>
				</div>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<p className='text-body3'>Phone</p>
					<p className='text-body3 font-medium text-secondarygray-light'>
						{member.phone || member.user?.phone || 'Not provided'}
					</p>
				</div>
				<div>
					<p className='text-body3'>Email Address</p>
					<p className='text-body3 font-medium text-secondarygray-light'>
						{member.email || member.user?.email || 'Not provided'}
					</p>
				</div>
			</div>
		</div>
	);
};
