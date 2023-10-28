"use client"

import { Trash } from "lucide-react"
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConffetiStore } from "@/hooks/use-confetti-store";

interface ActionsProps {
	disabled: boolean;
	courseId: string;
	isPublished: boolean
}

export const Actions = ({
	courseId,
	disabled,
	isPublished
}: ActionsProps) => {
	const [loading, setLoading] = useState(false)

	const router = useRouter()

	const confetti = useConffetiStore()

	const handleTogglePublish = async () => {
		try {	
			setLoading(true)

			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/unpublish`)
				toast.success("Unpublished")
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`)
				toast.success("Published")
				confetti.onOpen()
			}

			router.refresh()
		} catch (err) {
			toast.error("Something went wrong")
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async () => {
		try {
			setLoading(true)

			await axios.delete(`/api/courses/${courseId}`)

			toast.success("Deleted successfully!")
			router.refresh()
			router.push(`/teacher/courses`)
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