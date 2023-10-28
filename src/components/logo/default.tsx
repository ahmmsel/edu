"use client"

import Image from "next/image"

export const Logo = () => {
	return (
		<Image 
			width={80}
			height={80}
			alt="logo"
			src="/logo.svg"
		/>
	)
}