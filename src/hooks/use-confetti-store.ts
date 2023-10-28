import { create } from "zustand"

interface ConffetiStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void
}

export const useConffetiStore = create<ConffetiStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false })
}))