import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import TransitionLayout from '@/components/layouts/TransitionLayout';

const SITE_URL =
	process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),

	title: 'Audiophile',
	description: 'A place for audiophiles to find the best products',
	icons: {
		icon: '/favicon.png',
	},
	openGraph: {
		title: 'Audiophile',
		description: 'A place for audiophiles to find the best products',
		images: [
			{
				url: '/audiophile-og.png',
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='antialiased bg-black h-full'>
				<Header />
				<TransitionLayout>{children}</TransitionLayout>
				<Footer />
			</body>
		</html>
	);
}
