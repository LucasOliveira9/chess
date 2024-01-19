"use client";

import { useEffect } from "react";
import { useMultiplayerContext } from "../lib/context/multiplayer.context/multiplayer.provider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { state } = useMultiplayerContext();
  const router = useRouter();
  useEffect(() => {
    if (state.onRoom === false) router.push("/multiplayer/room/enter");
    else if (state.onRoom === true) router.push("/multiplayer/room/game");
  }, [state.onRoom]);
  return null;
};

export default Page;
