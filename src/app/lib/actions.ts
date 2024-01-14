import { stompClientFreemode } from "./socket";
import { z } from "zod";

const SetBoardSchema = z.object({
  fen: z
    .string({
      invalid_type_error: "Invalid String",
    })
    .refine(
      (data) => {
        return validateFen(data);
      },
      { message: "Invalid fen" }
    ),
});

function validateFen(fen: string): boolean {
  const length = fen.replace(/\s+/g, " ").split(" ");
  if (length.length !== 2) return false;
  else if (length[1].toLowerCase() !== "w" && length[1].toLowerCase() !== "b")
    return false;

  const board = length[0];
  const arr = [];
  const validPieces = [
    "p",
    "P",
    "b",
    "B",
    "N",
    "n",
    "r",
    "R",
    "q",
    "Q",
    "k",
    "K",
  ];
  let whiteKing = false,
    blackKing = false;
  let slashCount = 0;
  for (const i of board) {
    if (i === "/") {
      slashCount++;
      continue;
    }

    if (!isNaN(+i)) {
      for (let j = 1; j <= +i; j++) {
        arr.push("e");
      }
      continue;
    }
    if (!validPieces.includes(i)) return false;

    i === "k" ? (blackKing = true) : null;
    i === "K" ? (whiteKing = true) : null;
    arr.push(i);
  }
  if (arr.length !== 64 || !blackKing || !whiteKing || slashCount !== 7)
    return false;
  return true;
}

export const SetBoard = async (
  prevState: { message?: string },
  formData: FormData
) => {
  const validatedFields = SetBoardSchema.safeParse({
    fen: formData.get("setboard"),
  });

  console.log(validatedFields);
  if (!validatedFields.success)
    return {
      message:
        "Invalid fen. check for any spaces, extra pieces or slash in the input. Besides, check if you are setting the turn correctly and if at least one king from the two players are in the fen",
    };

  const id = localStorage.getItem("freemode");
  const { fen } = validatedFields.data;
  if (!stompClientFreemode?.connected)
    return { message: "Connection not stablished yet" };
  if (!id)
    return {
      message: "start a new game before set the board",
    };
  stompClientFreemode?.send(
    "/chess/topic/freemode/set_board",
    {},
    JSON.stringify({ id, fen })
  );
  return { message: "Board settled" };
};

export const NewGame = async (prevState?: { message?: string }) => {
  const id = localStorage.getItem("freemode");
  if (!stompClientFreemode?.connected)
    return { message: "Connection not stablished yet" };
  if (!id)
    return {
      message: "Can't restart because there's no iniatilized game before this",
    };
  stompClientFreemode?.send(
    "/chess/topic/freemode/restart",
    {},
    JSON.stringify({ id })
  );
  return {
    message: "game restarted",
  };
};
