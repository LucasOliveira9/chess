"use client";
import { useFormState } from "react-dom";
import { FreemodeContextProvider } from "../lib/context/freemode.context/freemode.provider";
import Board from "@/app/ui/components/board";
import { NewGame, SetBoard } from "../lib/actions/actions";
import Notation from "../ui/components/notation";
import Fen from "../ui/components/fen";

const initialState: { message?: string } = {
  message: "",
};

const initialBoardState: { message?: string } = {
  message: "",
};
const Page = () => {
  const [state, dispatchNG] = useFormState(NewGame, initialState);
  const [setboardState, dispatchSB] = useFormState(SetBoard, initialBoardState);
  return (
    <main style={{ padding: "2em", marginLeft: "21em" }}>
      <FreemodeContextProvider>
        <Board />
        <div>
          <Notation />
        </div>
        <form action={dispatchNG}>
          <button type="submit">RESTART</button>
        </form>
        <span>{state.message}</span>

        <form action={dispatchSB}>
          <input type="text" id="setboard" name="setboard" />
          <button type="submit">Set Board</button>
        </form>
        <Fen />
        <span>{setboardState.message}</span>
      </FreemodeContextProvider>
    </main>
  );
};

export default Page;
