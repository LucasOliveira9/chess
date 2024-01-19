import { useFreemodeContext } from "./freemode.context/freemode.provider";
import { useMultiplayerContext } from "./multiplayer.context/multiplayer.provider";

function useContext(path: string) {
  return path === "/freemode" ? useFreemodeContext() : useMultiplayerContext();
}

export { useContext };
