"use client"

import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConffetiStore } from "@/hooks/use-confetti-store";

import { Button } from "@/components/ui/button";


interface CourseProgressButtonProps {
	chapterId: string;
	courseId: string;
	nextChapterId?: string;
	isCompleted?: boolean;
}

export const CourseProgressButton = ({
	chapterId,
	courseId,
	isCompleted,
	nextChapterId
}: CourseProgressButtonProps) => {
	const router = useRouter()
	const conffeti = useConffetiStore()
	const [isLoading, setIsLoading] = useState(false)

	const Icon = isCompleted ? XCircle : CheckCircle

	const handleClick = async () => {
		try {
			setIsLoading(true)

			await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
				isCompleted: !isCompleted
			})

			if (!isCompleted && !nextChapterId) {
				conffeti.onOpen()
			}

			if (!isCompleted && nextChapterId) {
				router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
			}

			toast.success("Progress updated")
			router.refresh()
		} catch {
			toast.error("Something went wrong!")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			type="button"
			variant={isCompleted ? "outline" : "success"}
			onClick={handleClick}
			disabled={isLoading}
		>
			{isCompleted ? "Not Completed" : "Mark as complete"}
			<Icon className="w-4 h-4 ml-2" />
		</Button>
	)
}