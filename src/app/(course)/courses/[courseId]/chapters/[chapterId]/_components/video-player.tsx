"use client"

import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
	courseId: string;
	chapterId: string;
	title: string;
	nextChapterId?: string;
	playbackId: string;
	isLocked: boolean;
	completeOnEnd: boolean;
}

export const VideoPlayer = ({
	chapterId,
	completeOnEnd,
	courseId,
	isLocked,
	nextChapterId,
	playbackId,
	title
}: VideoPlayerProps) => {
	const [ready, setReady] = useState(false)

	return (
		<div className="relative aspect-video">
			{!ready && !isLocked && (
				<div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
					<Loader2 className="w-8 h-8 animate-spin text-secondary" />
				</div>
			)}
			{isLocked && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
					<Lock className="w-8 h-8 text-secondary" />
					<p className="text-sm">This Chapter is Locked!</p>
				</div>
			)}
			{!isLocked && (
				<MuxPlayer
					title={title}
					playbackId={playbackId}
					className={cn(
						!ready && "hidden"
					)}
					onCanPlay={() => setReady(true)}
					onEnded={() => {}}
					autoPlay
				/>
			)}
		</div>
	)
}