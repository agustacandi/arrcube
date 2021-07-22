import { useState } from 'react';
import Router from 'next/router';
import { unauthPage } from '../../middlewares/authorizationPage';
import Head from 'next/head';
import Link from 'next/link';

export async function getServerSideProps(ctx) {
	await unauthPage(ctx);
	return {
		props: {},
	};
}

export default function Register() {
	const [user, setUser] = useState({
		name: '',
		username: '',
		email: '',
		password: '',
		imageUrl: '',
	});

	const [status, setStatus] = useState('normal');

	async function registerHandler(e) {
		e.preventDefault();

		setStatus('loading');

		const register = await fetch('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(user),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!register.ok) return setStatus('error ' + register.status);

		setStatus('success');

		Router.push('/auth/login');
	}

	function fieldsHandler(e) {
		const name = e.target.getAttribute('name');

		setUser({
			...user,
			[name]: e.target.value,
		});
	}

	return (
		<>
			<Head>
				<title>Register | Arrcube Organization</title>
			</Head>
			<div className='min-h-screen bg-gray-200'>
				<div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
					<img src='/arrcube.png' alt='Arrcube Logo' className='w-20 mx-auto' />
					<h2 className='text-2xl font-bold text-gray-500 text-center'>
						Register
					</h2>
					<p className='text-center text-gray-400'>status: {status}</p>
					<form onSubmit={registerHandler.bind(this)}>
						<input
							onChange={fieldsHandler.bind(this)}
							type='text'
							name='name'
							placeholder='Name'
							autoComplete='off'
							className='mt-3 py-2 px-2 text-sm border-2 border-white block rounded focus:outline-none focus:border-2 w-full focus:border-gray-500'
						/>
						<input
							onChange={fieldsHandler.bind(this)}
							type='text'
							name='username'
							placeholder='Username'
							autoComplete='off'
							className='mt-3 py-2 px-2 text-sm border-2 border-white block rounded focus:outline-none focus:border-2 w-full focus:border-gray-500'
						/>
						<input
							onChange={fieldsHandler.bind(this)}
							type='text'
							name='email'
							placeholder='Email'
							autoComplete='off'
							className='mt-3 py-2 px-2 text-sm border-2 border-white block rounded focus:outline-none focus:border-2 w-full focus:border-gray-500'
						/>
						<input
							onChange={fieldsHandler.bind(this)}
							type='text'
							name='imageUrl'
							placeholder='Image URL'
							autoComplete='off'
							className='mt-3 py-2 px-2 text-sm border-2 border-white block rounded focus:outline-none focus:border-2 w-full focus:border-gray-500'
						/>
						<input
							onChange={fieldsHandler.bind(this)}
							type='password'
							name='password'
							placeholder='Password'
							autoComplete='off'
							className='mt-3 py-2 px-2 text-sm border-2 border-white block rounded focus:outline-none focus:border-2 w-full focus:border-gray-500'
						/>
						{status === 'loading' ? (
							''
						) : (
							<button className='bg-gray-500 rounded text-white mt-3 w-full hover:shadow py-2 text-sm'>
								Register
							</button>
						)}
					</form>
					<p className='text-gray-400 mt-3 text-center'>
						Already have an account?{' '}
						<Link href='/auth/login'>
							<a className='text-gray-500 hover:underline'>Log in</a>
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
