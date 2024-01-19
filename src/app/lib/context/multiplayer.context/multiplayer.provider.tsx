import { config } from "@/app/lib/chess/chess.config";
import { IMultiplayerContext, IState } from "./multiplayer.interface";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";
import Reducer from "./multiplayer.reducer";

export const STATE: IState = {
  poss: new Map(),
  board: config.board,
  restart: false,
  fen: "",
  winner: "",
  player: "",
  enemie: "Opponent",
  color: "white",
  notation: [],
  history: [],
  captured: [],
  ping: { white: -1, black: -1 },
  chat: [],
  timer: { white: 300000, black: 300000 },
  whiteDisconnectTimer: -1,
  blackDisconnectTimer: -1,
  onRoom: undefined,
  selectTimer: 300000,
  room: null,
  isPlaying: false,
  revenge: false,
  revengeOffer: false,
  selected: null,
  socket: null,
  admin: false,
};

const appContext = createContext<IMultiplayerContext>({
  state: STATE,
  dispatch: () => {},
});

export const MultiplayerContextProvider = (props: PropsWithChildren) => {
  const [state, dispatch] = useReducer(Reducer, STATE);

  return (
    <appContext.Provider value={{ state, dispatch }}>
      {props.children}
    </appContext.Provider>
  );
};

export function useMultiplayerContext() {
  return useContext(appContext);
}
