"use client"
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/format-currency"
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
	price: number;
	courseId: string;
}

export const CourseEnrollButton = ({
	price,
	courseId
}: CourseEnrollButtonProps) => {
	const [isLoading, setIsLoading] = useState(false)

	const handleClick = async () => {
		try {
			setIsLoading(true)

			const response = await axios.post(`/api/courses/${courseId}/checkout`)

			window.location.assign(response.data.url)
		} catch (error) {
			toast.error("Something went wrong!")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			disabled={isLoading}
			onClick={handleClick}
			className="w-full md:w-auto"
			size="sm"
		>
			Enroll for {formatCurrency(price)}
		</Button>
	)
}