import Bento from '@/components/layouts/Bento';
import Categories from '@/components/layouts/Categories';
import Hero from '@/components/layouts/Hero';

const Page = async () => {
	return (
		<main className=''>
			<Hero />
			<Categories />
			<Bento />
		</main>
	);
};

export default Page;
