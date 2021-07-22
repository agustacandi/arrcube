import { useState } from 'react';
import Router from 'next/router';
import { authPage } from '../../../middlewares/authorizationPage';
import jwtPayload from '../../../libs/jwtPayload';
import Layout from '../../../components/Layout';

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);

	const { id } = ctx.params;

	const user = await jwtPayload(token);

	const postReq = await fetch('http://localhost:3000/api/posts/' + id, {
		headers: {
			Authorization: process.env.AUTH_TYPE + ' ' + token,
		},
	});

	if (postReq.status !== 200) {
		return ctx.res
			.writeHead(302, {
				Location: '/posts',
			})
			.end();
	}

	const post = await postReq.json();

	return {
		props: { post, user, token },
	};
}

export default function CreatePost({ post, user, token }) {
	const { title, content, id } = post.post;
	const [myPost, setMyPost] = useState({
		title,
		content,
		author: user.username,
	});

	const [status, setStatus] = useState('normal');

	async function editPostHandler(e) {
		e.preventDefault();

		setStatus('loading');

		const editPost = await fetch('/api/posts/update/' + id, {
			method: 'PUT',
			body: JSON.stringify(myPost),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Nyanpassu' + ' ' + token,
			},
		});

		if (!editPost.ok) return setStatus('error ' + editPost.status);

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
			<h1 className='text-2xl font-black'>Edit Post</h1>
			<form onSubmit={editPostHandler.bind(this)}>
				<input
					onChange={fieldsHandler.bind(this)}
					type='text'
					name='title'
					placeholder='title'
					defaultValue={myPost.title}
					autoComplete='off'
					className='w-full block mt-5 p-2 text-sm rounded border-2 shadow border-white focus:outline-none focus:border-2 focus:border-gray-500 text-gray-500'
				/>
				<textarea
					onChange={fieldsHandler.bind(this)}
					type='text'
					name='content'
					placeholder='content'
					defaultValue={myPost.content}
					autoComplete='off'
					className='w-full block mt-5 p-2 h-40 rounded border-2 border-white focus:outline-none focus:border-2 focus:border-gray-500 text-gray-500 shadow'
				></textarea>
				<div className='flex justify-between mt-5 items-center'>
					<p className='text-sm'>status: {status}</p>
					{status === 'loading' ? (
						''
					) : (
						<button className='text-sm p-2 rounded bg-gray-500 text-white hover:bg-gray-400'>
							Edit Post
						</button>
					)}
				</div>
			</form>
		</Layout>
	);
}
