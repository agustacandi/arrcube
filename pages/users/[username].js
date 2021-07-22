import { authPage } from '../../middlewares/authorizationPage';
import jwtPayload from '../../libs/jwtPayload';
import { useState } from 'react';
import Router from 'next/router';
import Layout from '../../components/Layout';

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);
	const { username } = ctx.params;

	const usersReq = await fetch('http://localhost:3000/api/users/' + username, {
		headers: {
			Authorization: process.env.AUTH_TYPE + ' ' + token,
		},
	});

	if (!usersReq.ok) {
		return ctx.res
			.writeHead(302, {
				Location: '/posts',
			})
			.end();
	}

	const res = await usersReq.json();

	return {
		props: { res, token },
	};
}

export default function Posts({ res, token }) {
	const [user, setUser] = useState(res.user);
	return (
		<Layout>
			<h1 className='font-bold text-2xl'>User Profile</h1>
			<div className='p-5 rounded bg-white mt-5'>
				<img
					src={user.imageUrl}
					alt='Profile Pict'
					className='h-32 w-32 rounded-full object-cover mx-auto'
				/>
				<div className='flex justify-center py-5 items-center'>
					<h4 className='font-bold text-xl'>{user.name} </h4>
					{user.admin ? (
						<div className=''>
							<img
								src='/check.svg'
								alt=''
								className='bg-blue-500 rounded-full scale-50'
							/>
						</div>
					) : (
						''
					)}
				</div>
				<p className='text-center'>@{user.username}</p>
			</div>
		</Layout>
	);
}
