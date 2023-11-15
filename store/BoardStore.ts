import { ID, database, storage } from "@/appWrite";
import Board from "@/components/Board";
import { getTodosGroupByColumn } from "@/lib/getTodosGroupByColumn";
import { upLoadImage } from "@/lib/upLoadImage";
import { type } from "os";
import { create } from "zustand";
type Task = {
  status: string;
  message: string;
};
interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypeColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypeColumn) => void;
  inputTask: string;
  setInputTask: (input: string) => void;
  inputDescription: string;
  setInputDescription: (description: string) => void;
  newTaskType: TypeColumn;
  setNewTaskType: (task: TypeColumn) => void;
  imageTask: File | null;
  setImageTask: (image: File | null) => void;
  priorityTask: Priority;
  setPriorityTask: (priority: any) => void;
  addTask: (
    todo: string,
    priority: Priority,
    id: string,
    description: string,
    columnId: TypeColumn,
    image?: File | null
  ) => void;
  editTask: (
    id: string,
    priority: Priority,
    indexTask: number,
    todo: Todo,
    title: string,
    description: string,
    startCol: TypeColumn,
    endCol: TypeColumn,
    addImages?: File | undefined,
    removeImages?: Image[]
  ) => void;
  statusCrateTask: Task;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypeColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupByColumn();
    set({ board });
  },

  searchString: "",

  setSearchString: (searchString) => set({ searchString }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypeColumn) => {
    const newColumns = new Map(get().board.columns);
    newColumns.get(id)?.data.splice(taskIndex, 1);
    newColumns.get(id)?.data.sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      return 0;
    });
    set({
      board: {
        columns: newColumns,
      },
    });

    if (todo.image) {
      todo.image.map(async (item) => {
        const convertItem = JSON.parse(item);
        await storage.deleteFile(convertItem.bucketId, convertItem.fileId);
      });
    }
    await database.deleteDocument(
      "6530c974452a29777337",
      "6530c98e46ccbce155e9",
      todo.$id
    );
    set({
      statusCrateTask: {
        status: "success",
        message: "Delete a task success",
      },
    });
    setTimeout(() => {
      set({
        statusCrateTask: {
          status: "hide",
          message: "hide",
        },
      });
    }, 2000);
  },

  inputTask: "",
  setInputTask: (input: string) => set({ inputTask: input }),

  imageTask: null,
  setImageTask: (image: File | null) => set({ imageTask: image }),

  inputDescription: "",
  setInputDescription: (description: string) => {
    set({ inputDescription: description });
  },
  priorityTask: "1",
  setPriorityTask: (priority: any) => {
    set({ priorityTask: priority });
  },

  setBoard: (board) => set({ board }),

  newTaskType: "todo",
  setNewTaskType: (task: TypeColumn) => set({ newTaskType: task }),

  updateTodoInDB: async (todo, columnId) => {
    await database.updateDocument(
      "6530c974452a29777337",
      "6530c98e46ccbce155e9",
      todo.$id,
      {
        Title: todo.title,
        Status: columnId,
      }
    );
  },
  addTask: async (
    todo: string,
    priority: Priority,
    id: string,
    description: string,
    columnId: TypeColumn,
    image?: File | null
  ) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await upLoadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await database.createDocument(
      "6530c974452a29777337",
      "6530c98e46ccbce155e9",
      ID.unique(),
      {
        Title: todo,
        Status: columnId,
        Description: description,
        ID: id,
        Priority: priority,
        ...(file && { Image: [JSON.stringify(file)] }),
      }
    );
    if ($id) {
      set({
        statusCrateTask: {
          message: "Create a task success",
          status: "success",
        },
      });
    } else {
      set({
        statusCrateTask: {
          message: "Create a task fault",
          status: "error",
        },
      });
    }

    setTimeout(() => {
      set({
        statusCrateTask: {
          status: "hide",
          message: "hide",
        },
      });
    }, 2000);

    set({ inputTask: "" });
    set({ inputDescription: "" });

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        description: description,
        id: id,
        priority: priority,
        ...(file && { image: [JSON.stringify(file)] }),
      };

      const column = newColumns.get(columnId);
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          data: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.data.unshift(newTodo);
        newColumns.get(columnId)?.data.sort((a, b) => {
          if (a.priority < b.priority) {
            return -1;
          }
          if (a.priority > b.priority) {
            return 1;
          }
          return 0;
        });
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
  statusCrateTask: {
    status: "hide",
    message: "hide",
  },
  editTask: async (
    id: string,
    priority: Priority,
    indexTask: number,
    todo: Todo,
    inputTodo: string,
    description: string,
    startCol: TypeColumn,
    endCol: TypeColumn,
    addImages?: File | undefined,
    removeImages?: Image[]
  ) => {
    let file: Image | undefined | null;
    if (removeImages?.length! > 0) {
      removeImages?.map(async (image) => {
        await storage.deleteFile(image.bucketId, image.fileId);
      });
    }
    if (addImages) {
      const fileUploaded = await upLoadImage(addImages!);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }
    const dataImageUpdate: any[] = [];
    const dataImage: any[] = [];
    if (file) {
      const newFile = {
        bucketId: file?.bucketId,
        fileId: file?.fileId,
      };
      todo.image?.map((item) => {
        dataImageUpdate.push(item);
      });
      dataImage.push(JSON.stringify(newFile));
      dataImageUpdate.push(JSON.stringify(newFile));
    }

    const { $id } = await database.updateDocument(
      "6530c974452a29777337",
      "6530c98e46ccbce155e9",
      todo.$id,
      {
        ...(inputTodo && { Title: inputTodo }),
        ...(priority && { Priority: priority }),
        ...(endCol ? { Status: endCol } : { Status: startCol }),
        ...(description && { Description: description }),
        ...(file !== undefined && { Image: dataImageUpdate }),
      }
    );

    if ($id) {
      set({
        statusCrateTask: {
          message: "Edit a task success",
          status: "success",
        },
      });
    } else {
      set({
        statusCrateTask: {
          message: "Edit a task fault",
          status: "error",
        },
      });
    }

    setTimeout(() => {
      set({
        statusCrateTask: {
          status: "hide",
          message: "hide",
        },
      });
    }, 2000);
    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        $id,
        $createdAt: todo.$createdAt,
        $updatedAt: new Date().toISOString(),
        title: inputTodo,
        status: endCol || startCol,
        description: description,
        id: id,
        priority: priority,
        ...(file !== undefined && { image: dataImage }),
      };
      const newData = newColumns
        .get(todo.status)
        ?.data.filter((item) => item.$id !== todo.$id);
      if (newData) {
        newColumns.set(endCol || startCol, {
          id: todo.status,
          data: [...newData, newTodo],
        });
      }
      // handel when change task
      if (startCol !== endCol) {
        const columns = Array.from(get().board.columns);
        let startIndex: number = 0;
        let endIndex: number = 0;
        for (let i = 0; i < columns.length; i++) {
          if (columns[i][0] == startCol) {
            startIndex = i;
          } else if (columns[i][0] == endCol) {
            endIndex = i;
          }
        }
        const startColData = columns[startIndex][1].data;
        const [todoRemove] = startColData.splice(indexTask, 1);
        todoRemove.status = endCol;

        const endColData = columns[endIndex][1].data;
        endColData.splice(0, 0, todoRemove);
        newColumns.set(startCol, {
          id: startCol,
          data: startColData,
        });
        newColumns.set(endCol, {
          id: endCol,
          data: endColData,
        });
      }
      newColumns.get(todo.status)?.data.sort((a, b) => {
        if (a.priority < b.priority) {
          return -1;
        }
        if (a.priority > b.priority) {
          return 1;
        }
        return 0;
      });
      return {
        board: {
          ...state.board,
          columns: newColumns,
        },
      };
    });
  },
}));
