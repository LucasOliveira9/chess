"use client";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
} from "react";

import Reducer from "./freemode.reducer";
import { IFreemodeContext, IState } from "./freemode.interface";
import { config } from "../../chess/chess.config";

export const STATE: IState = {
  poss: new Map(),
  board: config.board,
  restart: false,
  winner: "",
  notation: [],
  history: [],
  captured: [],
  fen: "",
  player: "White",
  enemie: "Black",
  color: "white",
  selected: null,
};
const appContext = createContext<IFreemodeContext>({
  state: STATE,
  dispatch: () => {},
});

export const FreemodeContextProvider = (props: PropsWithChildren) => {
  const [state, dispatch] = useReducer(Reducer, STATE);

  return (
    <appContext.Provider value={{ state, dispatch }}>
      {props.children}
    </appContext.Provider>
  );
};

export function useFreemodeContext() {
  return useContext(appContext);
}
