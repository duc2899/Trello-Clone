import { create } from "zustand";

interface ModalState {
  isOpenDetail: boolean;
  openModalDetail: () => void;
  closeModalDetail: () => void;
  todoDetail: Todo | null;
  indexTask: number | null;
  setTodoDetail: (todo: Todo, indexTask: number) => void;
  isOpenModal: boolean;
  setIsOpeModal: (isOpenModal: boolean) => void;
}

export const useModalTaskDetail = create<ModalState>()((set) => ({
  isOpenDetail: false,
  openModalDetail: () => set({ isOpenDetail: true }),
  closeModalDetail: () => set({ isOpenDetail: false, todoDetail: null }),
  todoDetail: null,
  indexTask: null,
  setTodoDetail: (todo: Todo, indexTask: number) => {
    set({ todoDetail: todo, indexTask: indexTask });
  },
  isOpenModal: false,
  setIsOpeModal: (isOpenModal: boolean) => {
    set({ isOpenModal: isOpenModal });
  },
}));
