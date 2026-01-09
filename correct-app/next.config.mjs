/** @type {import('next').NextConfig} */
const nextConfig = {
	// Environment variables
	env: {
		API_URL: process.env.API_URL,
		AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
		AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
		AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	},

	// Image optimization configuration
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'compliance-new.s3.ap-south-1.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'plus.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'randomuser.me',
			},
		],
		// Enable modern image formats (WebP, AVIF)
		formats: ['image/avif', 'image/webp'],
	},

	// Performance optimizations
	compress: true, // Enable gzip compression
	productionBrowserSourceMaps: false, // Disable source maps in production to reduce bundle size

	// Automatic tree-shaking for heavy libraries
	// This dramatically reduces bundle size for Radix UI and other modular packages
	experimental: {
		optimizePackageImports: [
			'@radix-ui/react-accordion',
			'@radix-ui/react-alert-dialog',
			'@radix-ui/react-avatar',
			'@radix-ui/react-checkbox',
			'@radix-ui/react-collapsible',
			'@radix-ui/react-dialog',
			'@radix-ui/react-dropdown-menu',
			'@radix-ui/react-icons',
			'@radix-ui/react-label',
			'@radix-ui/react-popover',
			'@radix-ui/react-progress',
			'@radix-ui/react-scroll-area',
			'@radix-ui/react-select',
			'@radix-ui/react-separator',
			'@radix-ui/react-slider',
			'@radix-ui/react-slot',
			'@radix-ui/react-switch',
			'@radix-ui/react-tabs',
			'@radix-ui/react-toast',
			'@radix-ui/react-tooltip',
			'lucide-react',
			'date-fns',
		],
	},

	// Disable dev indicators in production
	devIndicators: false,
};

export default nextConfig;
