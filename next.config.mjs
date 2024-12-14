/** @type {import('next').NextConfig} */

import withBundleAnalyzer from '@next/bundle-analyzer';

var bundleAnalyzer = withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
	compiler: {
		styledComponents: true,
	},
};

export default bundleAnalyzer(nextConfig);
