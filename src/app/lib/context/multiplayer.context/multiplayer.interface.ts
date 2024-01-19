export interface IState {
  poss: Map<string, string[]>;
  board: string[];
  restart: boolean;
  winner: "white" | "black" | "";
  player: string;
  enemie: string;
  color: "white" | "black";
  notation: string[];
  history: string[][];
  fen: string;
  captured: string[];
  ping: { white: number; black: number };
  chat: object[];
  timer: { white: number; black: number };
  whiteDisconnectTimer: number;
  blackDisconnectTimer: number;
  onRoom: boolean | undefined;
  selectTimer: number;
  room: string | null;
  isPlaying: boolean;
  revenge: boolean;
  revengeOffer: boolean;
  selected: string | null;
  socket: null;
  admin: boolean;
}

export interface IMultiplayerContext {
  state: IState;
  dispatch: React.Dispatch<TAction>;
}

export type TAction =
  | { type: "SETPLAYER"; payload: string }
  | { type: "SETCOLOR"; payload: "white" | "black" }
  | { type: "SETENEMIE"; payload: string }
  | { type: "SETFEN"; payload: string }
  | { type: "SETNOTATION"; payload: string | string[] }
  | { type: "SETHISTORY"; payload: string[][] }
  | { type: "SETPING"; payload: { white: number; black: number } }
  | { type: "SETCHAT"; payload: object[] }
  | { type: "SETTIMER"; payload: { white: number; black: number } }
  | { type: "SETWHITEDISCONNECTTIMER"; payload: number }
  | { type: "SETBLACKDISCONNECTTIMER"; payload: number }
  | { type: "SETONROOM"; payload: boolean | undefined }
  | { type: "SETSELECTTIMER"; payload: number }
  | { type: "SETROOM"; payload: string | null }
  | { type: "SETCAPTURED"; payload: string[] }
  | { type: "SETISPLAYING"; payload: boolean }
  | { type: "SETREVENGE"; payload: boolean }
  | { type: "SETREVENGEOFFER"; payload: boolean }
  | { type: "SETBOARD"; payload: string[] }
  | { type: "SETPOSS"; payload: Map<string, string[]> }
  | { type: "RESTARTBOARD"; payload?: null }
  | { type: "SETWINNER"; payload: "white" | "black" | "" }
  | { type: "SETSELECTED"; payload: string | null }
  | { type: "SETADMIN"; payload: boolean }
  | { type: "REMATCH"; payload: { player1: string; player2: string } };
