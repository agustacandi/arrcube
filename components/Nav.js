import Link from 'next/link';
import Cookies from 'js-cookie';
import Router from 'next/router';

export default function Nav() {
	function logout(e) {
		e.preventDefault();

		Cookies.remove('token');

		window.location.reload();
	}

	return (
		<nav className=' sticky top-0 left-0 right-0 z-10 bg-white shadow text-gray-700'>
			<div className='flex items-center'>
				<img
					src='/arrcube.png'
					alt='Arrcube Logo'
					className='w-12 py-2 px-1 cursor-pointer bg-gray-400 hover:bg-gray-300'
					onClick={() => Router.replace('/posts')}
				/>
				<div className='flex justify-between w-full items-center'>
					<div>
						<Link href='/posts/create'>
							<a className='hover:bg-gray-300 px-4 text-sm'>Create post</a>
						</Link>
						<Link href='/users'>
							<a className='hover:bg-gray-300 px-4 text-sm'>Users</a>
						</Link>
					</div>
					<Link href=''>
						<a
							className='hover:bg-gray-300 px-4 text-sm'
							onClick={logout.bind(this)}
						>
							Log out
						</a>
					</Link>
				</div>
			</div>
		</nav>
	);
}
