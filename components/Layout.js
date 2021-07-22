import Head from 'next/head';
import Footer from './Footer';
import Nav from './Nav';

export default function Layout({ children }) {
	return (
		<>
			<Head>
				<title>Arrcube Organization</title>
			</Head>
			<Nav />
			<div className='min-h-screen bg-gray-100 text-gray-700'>
				<div className='container mx-auto px-28 py-5'>{children}</div>
			</div>
			<Footer />
		</>
	);
}
