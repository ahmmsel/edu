"use client"

import { Category } from "@prisma/client"
import { HashIcon } from "lucide-react"
import { CategoryItem } from "./category-item"

interface CategoriesProps {
	items: Category[]
}

export const Categories = ({
	items
}: CategoriesProps) => {
	return (
		<div className="flex itmes-center gap-x-2 overflow-x-auto pb-2">
			{items.map((item) => (
				<CategoryItem 
					key={item.id}
					label={item.name}
					icon={HashIcon}
					value={item.id}
				/>
			))}
		</div>
	)
}