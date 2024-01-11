export interface IState {
  poss: Map<string, string[]>;
  board: string[];
  restart: boolean;
  winner: "white" | "black" | "";
  captured: string[];
  notation: string[];
  history: string[][];
  fen: string;
  player: "White";
  enemie: "Black";
  color: "white";
  selected: string | null;
}

export type TAction =
  | { type: "SETNOTATION"; payload: string[] | string }
  | { type: "SETHISTORY"; payload: string[][] }
  | { type: "SETFEN"; payload: string }
  | { type: "SETBOARD"; payload: string[] }
  | { type: "SETPOSS"; payload: Map<string, string[]> }
  | { type: "RESTARTBOARD"; payload?: null }
  | { type: "SETWINNER"; payload: "white" | "black" }
  | { type: "SETSELECTED"; payload: string | null }
  | { type: "SETCAPTURED"; payload: string[] };

export interface IFreemodeContext {
  state: IState;
  dispatch: React.Dispatch<TAction>;
}
