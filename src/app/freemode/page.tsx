"use client";
import { FreemodeContextProvider } from "../lib/context/freemode.context/freemode.provider";
import { stompClientFreemode } from "../lib/socket";
import Board from "../ui/board";
const Page = () => {
  const handleClick = () => {
    if (!stompClientFreemode?.connected) return;
    const id = localStorage.getItem("freemode");
    if (!id) return;
    stompClientFreemode?.send(
      "/chess/topic/freemode/restart",
      {},
      JSON.stringify({ id })
    );
  };
  return (
    <main style={{ padding: "2em" }}>
      <FreemodeContextProvider>
        <Board />
        <button onClick={handleClick}>RESTART</button>
      </FreemodeContextProvider>
    </main>
  );
};

export default Page;
