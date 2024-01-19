"use client";

import Board from "@/app/ui/components/board";
import Notation from "@/app/ui/components/notation";

const Page = () => {
  return (
    <main style={{ marginLeft: "21em" }}>
      <Board />
      <Notation />
    </main>
  );
};

export default Page;
