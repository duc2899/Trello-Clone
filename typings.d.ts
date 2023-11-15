interface Board {
  columns: Map<TypeColumn, Column>;
}
type TypeColumn = "todo" | "inprogress" | "done";
type Priority = "1" | "2" | "3";
interface Column {
  id: TypeColumn;
  data: Todo[];
}
interface Todo {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  title: string;
  status: TypeColumn;
  image?: string[] | undefined;
  description: string;
  id: string;
  priority: Priority;
}

interface Image {
  bucketId: string;
  fileId: string;
}
