"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Chapter, Course } from "@prisma/client"
import { Loader2, PlusCircle } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import axios from "axios"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChaptersList } from "./chapters-list"

const formSchema = z.object({
	title: z.string().min(1, {
		message: "Title Field Is Required"
	})
})

export const ChaptersForm = ({
	initialData,
	courseId
}: {
	initialData: Course & { chapters: Chapter[] },
	courseId: string
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false)

  const toggleCreating = () => setIsCreating((prevState) => !prevState);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter Created Successfully!");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const onReorder = async (updateData: { id: string, position: number }[]) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData
      })
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (chapterId: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`)
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin w-5 h-5 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Chapter Title
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? ( 
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Chapter Title
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Give your chapter a title."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && !initialData.chapters.length && (
        <div className="text-muted-foreground text-xs italic">No Chapters</div>
      )}
      <ChaptersList 
        onEdit={onEdit}
        onReorder={onReorder}
        items={initialData.chapters || []}
      />
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag And Drop Chapters
        </p>
      )}
    </div>
  )
}