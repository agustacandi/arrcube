import { authPage } from '../../middlewares/authorizationPage';
import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	const usersReq = await fetch('http://localhost:3000/api/users', {
		headers: {
			Authorization: process.env.AUTH_TYPE + ' ' + token,
		},
	});

	const res = await usersReq.json();

	return {
		props: { res, token },
	};
}

export default function Posts({ res, token }) {
	const [users, setUsers] = useState(res.users);
	return (
		<Layout>
			<h1 className='text-2xl font-bold'>Users</h1>
			<table className='table-auto bg-white rounded w-full text-center mt-5 shadow'>
				<thead>
					<tr>
						<th className='p-2'>Profile Pict</th>
						<th>Name</th>
						<th>Username</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => {
						return (
							<tr key={user.id}>
								<td className='p-2'>
									<img
										src={user.imageUrl}
										alt='Profile Pict'
										className='w-10 h-10 rounded-full object-cover mx-auto'
									/>
								</td>
								<td>
									<div className='flex justify-center'>
										<h4 className='hover:underline'>
											<Link href={'/users/' + user.username}>
												<a>{user.name}</a>
											</Link>
										</h4>
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
								</td>
								<td>{user.username}</td>
								<td>{user.email}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</Layout>
	);
}
