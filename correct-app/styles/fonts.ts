import localFont from 'next/font/local';

export const nickySans = localFont({
	src: [
		{
			path: '../public/fonts/NickySans-Regular.ttf',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../public/fonts/NickySans-Bold.ttf',
			weight: '700',
			style: 'normal',
		},
		{
			path: '../public/fonts/NickySans-Extrabold.ttf',
			weight: '800',
			style: 'normal',
		},
	],
	display: 'swap',
	variable: '--font-nicky-sans',
});
