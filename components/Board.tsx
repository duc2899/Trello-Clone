"use client";
import { useBoardStore } from "@/store/BoardStore";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { Suspense, useEffect } from "react";
import Column from "./Column";
function Board() {
  const [getBoard, board, setBoard, updateTodoInDB] = useBoardStore((state) => [
    state.getBoard,
    state.board,
    state.setBoard,
    state.updateTodoInDB,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  const handelDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    //  handel when drag item outside
    if (!destination) return;
    // handel when drag column
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [remove] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, remove);
      const resultColumns = new Map(entries);
      setBoard({
        ...board,
        columns: resultColumns,
      });
    }

    const columns = Array.from(board.columns);
    const startColumnIndex = columns[Number(source.droppableId)];
    const endColumnIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColumnIndex && startColumnIndex[0],
      data: startColumnIndex && startColumnIndex[1].data,
    };
    const endCol: Column = {
      id: endColumnIndex && endColumnIndex[0],
      data: endColumnIndex && endColumnIndex[1].data,
    };

    if (!startCol || !endCol) return;

    if (source.index === destination.index && startCol === endCol) return;

    const newTodos = startCol.data;

    const [todoRemoved] = newTodos && newTodos.splice(source.index, 1);

    if (startCol.id === endCol.id) {
      // when drag and drop card same column
      newTodos.splice(destination.index, 0, todoRemoved);
      const newCol = {
        id: startCol.id,
        data: newTodos,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoard({ ...board, columns: newColumns });
    } else {
      // when drag and drop card on another column
      const finishTodos = Array.from(endCol.data);
      finishTodos.splice(destination.index, 0, todoRemoved);
      finishTodos.sort((a, b) => {
        if (a.priority < b.priority) {
          return -1;
        }
        if (a.priority > b.priority) {
          return 1;
        }
        return 0;
      });
      newTodos.sort((a, b) => {
        if (a.priority < b.priority) {
          return -1;
        }
        if (a.priority > b.priority) {
          return 1;
        }
        return 0;
      });
      const newColumns = new Map(board.columns);

      // update startColumn
      newColumns.set(startCol.id, {
        id: startCol.id,
        data: newTodos,
      });
      //   update endColumn
      newColumns.set(endCol.id, {
        id: endCol.id,
        data: finishTodos,
      });

      updateTodoInDB(todoRemoved, endCol.id);
      setBoard({ ...board, columns: newColumns });
    }
  };
  return (
    <DragDropContext onDragEnd={handelDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="px-6 md grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Suspense key={id} fallback="Loading...">
                <Column id={id} todos={column.data} index={index} />
              </Suspense>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
