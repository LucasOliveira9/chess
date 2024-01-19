"use client";
import { MultiplayerContextProvider } from "../lib/context/multiplayer.context/multiplayer.provider";
import Board from "../ui/components/board";
import Notation from "../ui/components/notation";

const Page = () => {
  return (
    <main style={{ marginLeft: "21em" }}>
      <MultiplayerContextProvider>
        <Board />
        <Notation />
      </MultiplayerContextProvider>
    </main>
  );
};

export default Page;
