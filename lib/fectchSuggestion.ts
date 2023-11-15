import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);
  const res = await fetch("api/generateSummary", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTdata = await res?.json();

  const { content } = GPTdata;
  return content;
};

export default fetchSuggestion;
