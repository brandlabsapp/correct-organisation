const ProblemSection = () => {
	const stats = [
		{ value: '69,233+', label: 'compliances' },
		{ value: '6,618', label: 'filings' },
		{ value: '₹4.5L', label: 'spent annually per MSME' },
	];

	return (
		<section className='bg-white py-16 md:py-24'>
			<div className='container-custom'>
				<div className='text-center mb-16'>
					<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
						India&apos;s Compliance Burden is Real
					</h2>
					<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto'>
						Running a business in India means navigating a complex web of regulations
						that change frequently.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{stats.map((stat, index) => (
						<div key={index} className='stat-card'>
							<p className='text-mobile-heading1 md:text-subheading1 font-bold mb-2'>
								{stat.value}
							</p>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey'>
								{stat.label}
							</p>
						</div>
					))}
				</div>

				<p className='text-center text-heading4 mt-12 font-medium'>
					Most <strong>MSMEs</strong> run on &apos;
					<i>
						<strong>Jab hoga tab dekhenge</strong>
					</i>
					&apos;. Let&apos;s fix that.
				</p>
			</div>
		</section>
	);
};

export default ProblemSection;
