"use client"

import { Trash } from "lucide-react"
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface ChapterActionsProps {
	disabled: boolean;
	courseId: string;
	chapterId: string;
	isPublished: boolean
}

export const ChapterActions = ({
	chapterId,
	courseId,
	disabled,
	isPublished
}: ChapterActionsProps) => {
	const [loading, setLoading] = useState(false)

	const router = useRouter()

	const handleTogglePublish = async () => {
		try {	
			setLoading(true)

			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`)
				toast.success("Unpublished")
			} else {
				await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`)
				toast.success("Published")
			}

			router.refresh()
		} catch {
			toast.error("Something went wrong")
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async () => {
		try {
			setLoading(true)

			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)

			toast.success("Deleted successfully!")
			router.refresh()
			router.push(`/teacher/courses/${courseId}`)
		} catch {
			toast.error("Something went wrong")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={handleTogglePublish}
				disabled={disabled || loading}
				variant="outline"
				size="sm"
			>
				{isPublished ? "Unpublish" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={handleDelete}>
				<Button size="sm">
					<Trash className="w-4 h-4" />
				</Button>
			</ConfirmModal>
		</div>
	)
}