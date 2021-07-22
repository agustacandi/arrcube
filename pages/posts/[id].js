import { authPage } from '../../middlewares/authorizationPage';
import jwtPayload from '../../libs/jwtPayload';
import { useState } from 'react';
import Router from 'next/router';
import Layout from '../../components/Layout';

export async function getServerSideProps(ctx) {
	const { token } = await authPage(ctx);
	const { id } = ctx.params;
	const user = await jwtPayload(token);

	const postReq = await fetch('http://localhost:3000/api/posts/' + id, {
		headers: {
			Authorization: process.env.AUTH_TYPE + ' ' + token,
		},
	});

	if (!postReq.ok) {
		return ctx.res
			.writeHead(302, {
				Location: '/posts',
			})
			.end();
	}

	const commenstReq = await fetch('http://localhost:3000/api/comments/' + id, {
		headers: {
			Authorization: process.env.AUTH_TYPE + ' ' + token,
		},
	});

	const res = await postReq.json();
	const commentsRes = await commenstReq.json();

	return {
		props: { res, commentsRes, token, user },
	};
}

export default function Posts({ res, commentsRes, token, user }) {
	const [post, setPost] = useState(res.post);
	const [comments, setComments] = useState(commentsRes.comment);
	const [comId, setComId] = useState(0);
	const [comment, setComment] = useState({
		comment: '',
		name: user.name,
		username: user.username,
		postId: post.id,
		admin: user.admin,
		imageUrl: user.imageUrl,
	});
	const [update, setUpdate] = useState(false);
	const [upComment, setUpComment] = useState({
		comment: '',
	});

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
		}
	}

	async function commentHandler(e) {
		e.preventDefault();

		const sendComment = await fetch('/api/comments/add', {
			method: 'POST',
			body: JSON.stringify(comment),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Nyanpassu' + ' ' + token,
			},
		});

		if (!sendComment.ok) return alert('error ' + sendComment.status);

		window.location.reload();
	}

	async function updateCommentHandler(e) {
		e.preventDefault();

		const updateComment = await fetch('/api/comments/edit/' + comId, {
			method: 'PUT',
			body: JSON.stringify(upComment),
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Nyanpassu' + ' ' + token,
			},
		});

		window.location.reload();
	}

	function editCommentHandler(id) {
		setUpdate((bool) => !bool);
		setComId(id);
	}

	function fieldCommentHandler(e) {
		setUpComment({
			comment: e.target.value,
		});
	}

	function fieldHandler(e) {
		setComment({
			...comment,
			comment: e.target.value,
		});
	}

	return (
		<Layout>
			<div className='p-5 shadow hover:shadow-md transition-all duration-100 rounded bg-white'>
				<div className='flex space-x-3 items-center'>
					<img
						className='profile-pict'
						src={post.imageUrl}
						alt='profile pict'
						className='w-10 h-10 object-cover rounded-full'
					/>
					<div className='flex'>
						<h4 className='font-bold'>{post.name}</h4>
						{post.admin ? (
							<img
								src='/check.svg'
								alt=''
								className='bg-blue-500 rounded-full scale-50'
							/>
						) : (
							''
						)}
					</div>
				</div>
				<div className='py-5'>
					<h1 className='text-2xl font-black'>{post.title}</h1>
					<p className='text-sm text-gray-500'>{post.content}</p>
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
			<hr />
			{comments.map((com) => {
				return (
					<div
						key={com.id}
						className='p-5 shadow hover:shadow-md rounded transition-all duration-100 bg-white mt-5'
					>
						<div className='flex space-x-3 items-center'>
							<img
								className='profile-pict'
								src={com.imageUrl}
								alt='profile pict'
								className='w-10 h-10 rounded-full object-cover'
							/>
							<div className='flex'>
								<h4 className='font-bold'>{com.name}</h4>
								{com.admin ? (
									<img
										src='/check.svg'
										alt=''
										className='bg-blue-500 rounded-full scale-50'
									/>
								) : (
									''
								)}
							</div>
						</div>
						<p className='text-sm text-gray-500 py-5'>{com.comment}</p>
						{com.username !== user.username ? (
							''
						) : (
							<div className={`flex ${update ? '' : 'space-x-7'}`}>
								<p
									onClick={editCommentHandler.bind(this, com.id)}
									className={`text-gray-400 text-sm font-bold cursor-pointer hover:text-gray-500 ${
										update ? 'hidden' : ''
									}`}
								>
									Edit
								</p>
								<p className='text-gray-400 text-sm font-bold cursor-pointer hover:text-gray-500'>
									Delete
								</p>
							</div>
						)}
					</div>
				);
			})}

			{update ? (
				<form
					onSubmit={updateCommentHandler.bind(this)}
					className='flex items-center mt-5 space-x-5'
				>
					<input
						onChange={fieldCommentHandler.bind(this)}
						type='text'
						name='comment'
						placeholder='Update comment...'
						className='shadow focus:shadow-md rounded focus:outline-none focus:border-gray-500 focus:border-2 py-1 px-2 text-sm w-full border-2 border-white'
					/>
					<button className='text-sm py-1 px-2 bg-green-600 hover:bg-green-500 text-white rounded'>
						Update
					</button>
					<button
						onClick={() => setUpdate(false)}
						className='text-sm py-1 px-2 bg-gray-400 hover:bg-gray-300 text-white rounded'
					>
						Cancel
					</button>
				</form>
			) : (
				<form
					onSubmit={commentHandler.bind(this)}
					className='flex items-center mt-5 space-x-5'
				>
					<input
						onChange={fieldHandler.bind(this)}
						type='text'
						name='comment'
						placeholder='Say something...'
						className='shadow focus:shadow-md rounded focus:outline-none focus:border-gray-500 focus:border-2 py-1 px-2 text-sm w-full border-2 border-white'
					/>
					<button className='text-sm py-1 px-2 bg-green-600 hover:bg-green-500 text-white rounded'>
						Send
					</button>
				</form>
			)}
		</Layout>
	);
}
