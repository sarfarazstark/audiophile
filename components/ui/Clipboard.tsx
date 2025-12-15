'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ClipboardProps {
	text: string;
	children: React.ReactNode;
	className?: string;
}

export function Clipboard({ text, children, className }: ClipboardProps) {
	const [trigger, setTrigger] = useState(0);

	const handleClick = () => {
		navigator.clipboard.writeText(text);
		setTrigger((prev) => prev + 1);
	};

	return (
		<button
			onClick={handleClick}
			className={`relative group ${className}`}
			type="button"
		>
			<span className="relative z-10">{children}</span>

			{trigger > 0 && (
				<motion.span
					key={trigger}
					aria-hidden="true"
					className="absolute inset-0 pointer-events-none select-none text-grey-2"
					initial={{ opacity: 0.8, x: 0, y: 0 }}
					animate={{
						opacity: 0,
						x: 30,
						y: -20
					}}
					transition={{ duration: 0.6, ease: "easeOut" }}
				>
					{children}
				</motion.span>
			)}
		</button>
	);
}
