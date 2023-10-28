"use client"

import ReactConffeti from "react-confetti"

import { useConffetiStore } from "@/hooks/use-confetti-store"

export const ConffetiProvider = () => {
	const confetti = useConffetiStore()

	if (!confetti.isOpen) return null;

	return (
		<ReactConffeti 
			className="pointer-events-none z-[100]"
			numberOfPieces={500}
			recycle={false}
			onConfettiComplete={() => {
				confetti.onClose()
			}}
		/>
	)
}