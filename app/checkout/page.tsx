'use client';
import About from '@/components/layouts/About';
import Categories from '@/components/layouts/Categories';
import BackButton from '@/components/ui/BackButton';
import { useCart } from '@/lib/store/cart';
import Image from 'next/image';
import { useRef, useState } from 'react';
import * as z from 'zod';
import axios from 'axios';
import Rate from '@/lib/utility';

const checkoutSchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required') // empty value
		.min(5, 'Name must be at least 5 characters'), // too short

	email: z.string().email('Invalid email'),

	phone: z
		.string()
		.min(1, 'Phone is required')
		.min(10, 'Phone must be at least 10 digits'),

	address: z.string().min(1, 'Address is required'),
	pinCode: z.string().min(1, 'PIN is required').min(6, 'PIN too short'),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),

	paymentType: z.enum(['cod', 'online'], { message: 'Select one' }),
});

export default function Checkout() {
	const items = useCart((state) => state.items);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const formRef = useRef<HTMLFormElement>(null);
	// contains only id and quantity
	const filteredItems = items.map((item) => ({
		id: item.id,
		quantity: item.quantity,
	}));

	if (items.length === 0) {
		return (
			<div className='bg-white'>
				<div className='max-w-[1100px] min-h-[50vh] mx-auto px-4 relative h-full flex flex-col items-center justify-center'>
					<Image src={'/assets/cart.png'} width={250} height={250} alt='cart' />
					<p className='text-primary-6 text-center font-bold text-xl whitespace-break-spaces'>
						Your cart is empty.
						<br />
						Try shopping from one of our categories.
					</p>
				</div>
				<Categories />
				<About />
			</div>
		);
	}

	const cartSubtotal = items.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);

	const rate = new Rate(cartSubtotal);

	const shippingCost = rate.getShippingPrice();

	const vatAmount = rate.getVatPrice();

	const grandTotal = rate.getTotalPrice();

	const handleSubmit = async () => {
		if (!formRef.current) return;

		const formData = new FormData(formRef.current);
		const values = Object.fromEntries(formData);

		const result = checkoutSchema.safeParse(values);

		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;
			setErrors(fieldErrors as Record<string, string>);
			return;
		}

		setErrors({});
		const data = { data: result.data, items: filteredItems };

		try {
			console.log('here');

			const response = await axios.post('/api/checkout', data);
			console.log(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	const error = (field: keyof typeof errors) => errors[field]?.[0] ?? '';

	return (
		<div className='bg-primary-500 min-h-screen pb-12'>
			<div className='max-w-[1100px] mx-auto px-4 md:px-0 flex flex-col gap-8'>
				<div className='mt-12'>
					<BackButton />
				</div>
				<div className='grid grid-cols-[65%_1fr] gap-8'>
					<div className='bg-white rounded-lg p-12'>
						<h2 className='text-primary-6 font-bold text-3xl uppercase'>
							checkout
						</h2>
						<form
							ref={formRef}
							className='text-primary-200 grid grid-cols-2 gap-4'>
							<h3 className='uppercase text-sm tracking-wider font-bold text-primary col-span-full mt-12'>
								billing details
							</h3>
							<div className='flex flex-col gap-1'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='name'
										className='text-xs tracking-wide font-bold'>
										Name
									</label>
									<span className='text-red-500'>*</span>
									{error('name') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('name')}
										</span>
									)}
								</div>
								<input
									type='text'
									id='name'
									name='name'
									autoComplete='name'
									className='border-2 border-grey-3 rounded-md px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold'
									placeholder='e.g John Doe'
								/>
							</div>
							<div className='flex flex-col gap-1'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='email'
										className='text-xs tracking-wide font-bold'>
										Email address
									</label>
									<span className='text-red-500'>*</span>
									{error('email') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('email')}
										</span>
									)}
								</div>
								<input
									type='text'
									id='email'
									name='email'
									autoComplete='billing email'
									className='border-2 border-grey-3 rounded-md px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold'
									placeholder='e.g example@domain.com'
								/>
							</div>
							<div className='flex flex-col gap-1'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='phone'
										className='text-xs tracking-wide font-bold'>
										Phone number
									</label>
									<span className='text-red-500'>*</span>
									{error('phone') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('phone')}
										</span>
									)}
								</div>
								<input
									type='text'
									id='phone'
									name='phone'
									autoComplete='tel'
									className='border-2 border-grey-3 rounded-md px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold'
									placeholder='e.g 9876543210'
								/>
							</div>

							<h3 className='uppercase text-sm tracking-wider font-bold text-primary col-span-full mt-12'>
								shipping info
							</h3>

							<div className='flex flex-col gap-1 col-span-full'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='address'
										className='text-xs tracking-wide font-bold'>
										Address
									</label>
									<span className='text-red-500'>*</span>
									{error('name') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('address')}
										</span>
									)}
								</div>
								<input
									type='text'
									id='address'
									name='address'
									autoComplete='address'
									className='border-2 border-grey-3 rounded-md px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold'
									placeholder='e.g 123 Main St'
								/>
							</div>

							<div className='flex flex-col gap-1'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='pin'
										className='text-xs tracking-wide font-bold'>
										Pin Code
									</label>
									<span className='text-red-500'>*</span>
									{error('pinCode') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('pinCode')}
										</span>
									)}
								</div>
								<input
									type='text'
									id='pinCode'
									name='pinCode'
									autoComplete='postal-code'
									className='border-2 border-grey-3 rounded-md px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold'
									placeholder='e.g 123456'
								/>
							</div>

							<div className='flex flex-col gap-1'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='city'
										className='text-xs tracking-wide font-bold'>
										City
									</label>
									<span className='text-red-500'>*</span>
									{error('city') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('city')}
										</span>
									)}
								</div>
								<input
									type='text'
									id='city'
									name='city'
									autoComplete='address-level2'
									className='border-2 border-grey-3 rounded-md px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold'
									placeholder='e.g Kolkata'
								/>
							</div>

							<div className='flex flex-col gap-1'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='state'
										className='text-xs tracking-wide font-bold'>
										State
									</label>
									<span className='text-red-500'>*</span>
									{error('state') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('state')}
										</span>
									)}
								</div>
								<input
									type='text'
									id='state'
									name='state'
									autoComplete='address-level1'
									className='border-2 border-grey-3 rounded-md px-4 py-3 focus:outline-none focus:border-primary text-sm font-semibold'
									placeholder='e.g West Bengal'
								/>
							</div>

							<h3 className='uppercase text-sm tracking-wider font-bold text-primary col-span-full mt-12'>
								payment details
							</h3>
							<div className='flex flex-col gap-1 col-span-full'>
								<div className='w-full flex items-center'>
									<label
										htmlFor='paymentType'
										className='text-xs tracking-wide font-bold'>
										Payment Type
									</label>
									<span className='text-red-500'>*</span>
									{error('paymentType') && (
										<span className='text-red-500 ml-auto text-xs font-semibold'>
											{error('paymentType')}
										</span>
									)}
								</div>
								<div className='flex gap-4'>
									<label
										htmlFor='cod'
										className='flex-1 flex items-center gap-2 px-4 py-3 border-2 border-grey-3 rounded-md cursor-pointer hover:border-primary'>
										<input
											type='radio'
											id='cod'
											name='paymentType'
											value='cod'
											className='peer hidden'
										/>
										<span
											className="
											relative inline-flex items-center justify-center
											w-5 h-5 rounded-full border border-primary-2
											peer-checked:border-primary

											before:content-['']
											before:absolute before:inset-0 before:m-auto
											before:w-3 before:h-3 before:rounded-full
											before:transform before:transition-transform before:duration-150
											before:scale-0
											peer-checked:before:scale-100 peer-checked:before:bg-primary
										"></span>
										<span>Cash on Delivery</span>
									</label>

									<label
										htmlFor='online'
										className='flex-1 flex items-center gap-2 px-4 py-3 border-2 border-grey-3 rounded-md cursor-pointer hover:border-primary'>
										<input
											type='radio'
											id='online'
											name='paymentType'
											value='online'
											className='peer hidden'
										/>
										<span
											className="
											relative inline-flex items-center justify-center
											w-5 h-5 rounded-full border border-primary-2
											peer-checked:border-primary

											before:content-['']
											before:absolute before:inset-0 before:m-auto
											before:w-3 before:h-3 before:rounded-full
											before:transform before:transition-transform before:duration-150
											before:scale-0
											peer-checked:before:scale-100 peer-checked:before:bg-primary
										"></span>
										<span>Online Payment</span>
									</label>
								</div>
							</div>
						</form>

						<div className='mt-12 grid grid-cols-[75px_1fr] gap-4 text-grey-1'>
							<Image
								src='/assets/shared/payondelivery.png'
								width={75}
								height={125}
								alt='Payment Methods'
							/>
							<p>
								The ‘Cash on Delivery’ option enables you to pay in cash when
								our delivery courier arrives at your residence. Just make sure
								your address is correct so that your order will not be
								cancelled.
							</p>
						</div>
					</div>

					<div className='flex flex-col gap-4 bg-white rounded-lg px-10 py-8 sticky top-30 h-fit'>
						<h2 className='uppercase text-lg tracking-wider text-primary-200 font-bold'>
							Summary
						</h2>
						<div className='max-h-64 overflow-y-auto'>
							{items.map((item) => (
								<div
									key={item.id}
									className='flex justify-start items-center w-full gap-4 text-primary-200 mb-6 last:mb-0'>
									<Image
										src={item.imageUrl}
										width={60}
										height={60}
										alt={item.name}
										className='rounded-lg flex-1'
									/>
									<div className='overflow-hidden flex-2'>
										<p className='font-bold text-sm truncate' title={item.name}>
											{item.name}
										</p>
										<span className='text-xs'>
											$ {Intl.NumberFormat('en-US').format(item.price)}
										</span>
									</div>

									<span className='text-grey-1 flex-1 flex h-full items-center justify-end text-sm py-1 font-bold'>
										x{item.quantity}
									</span>
								</div>
							))}
						</div>
						<div className='flex flex-col justify-center items-start gap-2 text-primary-200'>
							{/* TOTAL (SUBTOTAL) */}
							<div className='flex justify-between text-primary-200 w-full'>
								<p className='font-bold text-[12px] uppercase text-grey-1'>
									Total
								</p>
								<p className='font-bold text-sm'>
									$ {Intl.NumberFormat('en-US').format(cartSubtotal)}
								</p>
							</div>

							{/* SHIPPING */}
							<div className='flex justify-between text-primary-200 w-full'>
								<p className='font-bold text-[12px] uppercase text-grey-1 tracking-wide'>
									Shipping
								</p>
								<p className='font-bold text-sm'>
									$ {Intl.NumberFormat('en-US').format(shippingCost)}
								</p>
							</div>

							{/* VAT */}
							<div className='flex justify-between text-primary-200 w-full'>
								<p className='font-bold text-[12px] uppercase text-grey-1 tracking-wide'>
									VAT (20%)
								</p>
								<p className='font-bold text-sm'>
									$ {Intl.NumberFormat('en-US').format(vatAmount)}
								</p>
							</div>

							{/* GRAND TOTAL */}
							<div className='flex justify-between text-primary-200 w-full mt-4'>
								<p className='font-bold text-[12px] uppercase text-grey-1 tracking-wide'>
									grand total
								</p>
								<p className='font-bold text-sm text-primary'>
									$ {Intl.NumberFormat('en-US').format(grandTotal)}
								</p>
							</div>
						</div>
						<div className='w-full'>
							<button
								onClick={handleSubmit}
								className='bg-primary w-full uppercase text-sm text-white px-6 md:px-8 py-3 font-bold cursor-pointer hover:bg-primary-1-lt transition-colors duration-500'>
								Continue & Pay
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
