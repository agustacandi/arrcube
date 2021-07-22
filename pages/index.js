import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
	return (
		<>
			<Head>
				<title>Arrcube Organization</title>
			</Head>
			<div className='min-h-screen bg-gray-200'>
				<div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
					<img src='/arrcube.png' alt='Arrcube Logo' className='w-52 mx-auto' />
					<h1 className='text-4xl font-black text-gray-500 text-center'>
						Arrcube Organization
					</h1>
					<h2 className='text-2xl font-bold text-gray-500 text-center'>
						We love computer science
					</h2>
					<div className='flex mt-5 justify-center space-x-5'>
						<Link href='/auth/login'>
							<a className='border-2 rounded text-gray-500 text-xl border-gray-500 hover:shadow py-1 px-4'>
								Login
							</a>
						</Link>
						<Link href='/auth/register'>
							<a className='border-2 rounded text-white bg-gray-500 text-xl border-gray-500 hover:shadow py-1 px-4'>
								Register
							</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
