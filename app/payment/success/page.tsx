export default function PaymentSuccessPage() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
			<div className="rounded-lg bg-white p-8 text-center shadow-lg md:w-[500px]">
				<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
					<svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h1 className="mb-4 text-3xl font-bold uppercase tracking-widest text-black">
					Payment Successful
				</h1>
				<p className="mb-8 text-black/50">
					Thank you for your purchase. Your order has been placed and is currently being processed.
				</p>
				<a
					href="/"
					className="inline-block w-full bg-[#D87D4A] px-6 py-4 text-[13px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-[#FBAF85]"
				>
					Back to Home
				</a>
			</div>
		</div>
	);
}
