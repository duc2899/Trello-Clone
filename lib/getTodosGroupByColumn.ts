import { database } from "@/appWrite";
import { Models, Query } from "appwrite";

export const getTodosGroupByColumn = async () => {
  const user = window && JSON.parse(window.localStorage.getItem("trello")!);
  const fetchData = await database.listDocuments(
    "6530c974452a29777337",
    "6530c98e46ccbce155e9",
    [Query.equal("ID", [user.userID])]
  );
  const data: Models.Document[] = fetchData.documents;
  const columns = data.reduce((acc, todo) => {
    if (!acc.get(todo.Status)) {
      acc.set(todo.Status, {
        id: todo.Status,
        data: [],
      });
    }

    acc.get(todo.Status)!.data.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.Title,
      status: todo.Status,
      description: todo.Description,
      id: todo.ID,
      priority: todo.Priority,
      ...(todo.Image && { image: todo.Image }),
    });
    acc.get(todo.Status)!.data.sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      return 0;
    });
    return acc;
  }, new Map<TypeColumn, Column>());

  const columnTypes: TypeColumn[] = ["todo", "inprogress", "done"];
  for (const columnType of columnTypes) {
    if (!columns.get(columnType)) {
      columns.set(columnType, {
        id: columnType,
        data: [],
      });
    }
  }

  const sortColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortColumns,
  };

  return board;
};
