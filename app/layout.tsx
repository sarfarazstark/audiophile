import type { Metadata } from 'next';
import './globals.css';
import Head from '@/components/layouts/Head';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
	title: 'Audiophile',
	description: 'A place for audiophiles to find the best products',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`antialiased bg-black`}>
				<Head />
				{children}
				<Footer />
			</body>
		</html>
	);
};
