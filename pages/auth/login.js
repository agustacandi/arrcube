import Cookies from 'js-cookie';
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

export default function Login() {
	const [user, setUser] = useState({
		username: '',
		password: '',
	});

	const [status, setStatus] = useState('normal');

	async function loginHandler(e) {
		e.preventDefault();

		setStatus('loading');

		const userLogin = await fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify(user),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!userLogin.ok) return setStatus('error ' + userLogin.status);

		const userToken = await userLogin.json();

		setStatus('success');

		Cookies.set('token', userToken.token);

		Router.push('/posts');
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
				<title>Login | Arrcube Organization</title>
			</Head>
			<div className='min-h-screen bg-gray-200'>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
					<img src='/arrcube.png' alt='Arrcube Logo' className='w-20 mx-auto' />
					<h2 className='text-2xl font-bold text-gray-500 text-center'>
						Log in
					</h2>
					<p className='text-center text-gray-400'>status: {status}</p>
					<form onSubmit={loginHandler.bind(this)}>
						<input
							onChange={fieldsHandler.bind(this)}
							type='text'
							name='username'
							placeholder='Username'
							autoComplete='off'
							className='mt-3 py-2 block w-full px-2 text-sm text-gray-500 rounded focus:outline-none focus:border-2 border-2 border-white focus:border-gray-500'
						/>
						<input
							onChange={fieldsHandler.bind(this)}
							type='password'
							name='password'
							placeholder='Password'
							autoComplete='off'
							className='mt-3 py-2 block w-full px-2 text-sm text-gray-500 rounded focus:outline-none focus:border-2 border-2 border-white focus:border-gray-500'
						/>
						{status === 'loading' ? (
							''
						) : (
							<button className='bg-gray-500 rounded text-white mt-3 w-full hover:shadow py-2 text-sm'>
								Log in
							</button>
						)}
					</form>
					<p className='text-gray-400 mt-3'>
						Don't have an account?{' '}
						<Link href='/auth/register'>
							<a className='text-gray-500 hover:underline'>Register</a>
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
