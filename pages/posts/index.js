import { authPage } from '../../middlewares/authorizationPage';
import jwtPayload from '../../libs/jwtPayload';
import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	const user = await jwtPayload(token);

	const postsReq = await fetch('http://localhost:3000/api/posts', {
		headers: {
			Authorization: process.env.AUTH_TYPE + ' ' + token,
		},
	});

	const postsData = await postsReq.json();

	return {
		props: { postsData, user, token },
	};
}

export default function Posts({ postsData, user, token }) {
	const [posts, setPosts] = useState(postsData.posts);

	function editHandler(id, e) {
		e.preventDefault();

		Router.replace('/posts/edit/' + id);
	}

	async function deleteHandler(id, e) {
		e.preventDefault();

		const ask = confirm('Are you sure?');

		if (ask) {
			await fetch('/api/posts/delete/' + id, {
				method: 'DELETE',
				headers: {
					Authorization: 'Nyanpassu' + ' ' + token,
				},
			});

			const postsFiltered = posts.filter((post) => {
				return post.id !== id && post;
			});

			setPosts(postsFiltered);
		}
	}

	return (
		<Layout>
			<h1 className='text-2xl font-black'>Posts</h1>
			{posts.map((post) => {
				return (
					<div key={post.id} className='p-5 shadow-md rounded bg-white my-5'>
						<Link href={`/users/${post.author}`}>
							<a>
								<div className='flex items-center space-x-3'>
									<img
										className='w-10 h-10 object-cover rounded-full'
										src={post.imageUrl}
										alt='profile pict'
									/>
									<div className='flex'>
										<h4 className='font-bold hover:underline'>{post.name} </h4>
										{post.admin ? (
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
								</div>
							</a>
						</Link>
						<div className='py-5'>
							<Link href={`/posts/${post.id}`}>
								<a>
									<h1 className='text-2xl font-black hover:underline'>
										{post.title}
									</h1>
									<p className='text-sm text-gray-500'>{post.content}</p>
								</a>
							</Link>
						</div>
						<div className='flex space-x-3'>
							{post.author !== user.username ? (
								''
							) : (
								<>
									<button
										onClick={editHandler.bind(this, post.id)}
										className='bg-green-600 text-white rounded py-1 px-2 text-sm hover:shadow hover:bg-green-500'
									>
										Edit
									</button>
									<button
										onClick={deleteHandler.bind(this, post.id)}
										className='bg-red-600 text-white rounded py-1 px-2 text-sm hover:shadow hover:bg-red-500'
									>
										Delete
									</button>
								</>
							)}
						</div>
					</div>
				);
			})}
		</Layout>
	);
}
