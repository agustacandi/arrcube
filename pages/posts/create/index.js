import { useState } from 'react';
import Router from 'next/router';
import { authPage } from '../../../middlewares/authorizationPage';
import jwtPayload from '../../../libs/jwtPayload';
import Layout from '../../../components/Layout';

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	const user = await jwtPayload(token);

	return {
		props: { user, token },
	};
}

export default function CreatePost({ user, token }) {
	const [myPost, setMyPost] = useState({
		title: '',
		content: '',
		author: user.username,
		name: user.name,
		imageUrl: user.imageUrl,
		admin: user.admin,
	});

	const [status, setStatus] = useState('normal');

	async function createPostHandler(e) {
		e.preventDefault();

		setStatus('loading');

		const createPost = await fetch('/api/posts/create/', {
			method: 'POST',
			body: JSON.stringify(myPost),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Nyanpassu' + ' ' + token,
			},
		});

		if (!createPost.ok) return setStatus('error ' + createPost.status);

		setStatus('success');

		Router.replace('/posts');
	}

	function fieldsHandler(e) {
		const name = e.target.getAttribute('name');

		setMyPost({
			...myPost,
			[name]: e.target.value,
		});
	}

	return (
		<Layout>
			<h1 className='text-2xl font-black'>Create Post</h1>
			<form onSubmit={createPostHandler.bind(this)}>
				<input
					onChange={fieldsHandler.bind(this)}
					type='text'
					name='title'
					placeholder='title'
					className='w-full block mt-5 p-2 text-sm rounded border-2 shadow border-white focus:outline-none focus:border-2 focus:border-gray-500 text-gray-500'
				/>
				<textarea
					onChange={fieldsHandler.bind(this)}
					type='text'
					name='content'
					placeholder='content'
					className='w-full block mt-5 p-2 h-40 rounded border-2 border-white focus:outline-none focus:border-2 focus:border-gray-500 text-gray-500 shadow'
				></textarea>
				<div className='flex justify-between mt-5 items-center'>
					<p className='text-sm'>status: {status}</p>
					{status === 'loading' ? (
						''
					) : (
						<button className='text-sm p-2 rounded bg-gray-500 text-white hover:bg-gray-400'>
							Create Post
						</button>
					)}
				</div>
			</form>
		</Layout>
	);
}
