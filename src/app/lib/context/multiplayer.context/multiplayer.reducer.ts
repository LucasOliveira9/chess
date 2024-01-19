import { IState, TAction } from "./multiplayer.interface";

const Reducer = (state: IState, { type, payload }: TAction): IState => {
  switch (type) {
    case "SETPLAYER":
      return { ...state, player: payload };

    case "SETENEMIE":
      return { ...state, enemie: payload };

    case "SETNOTATION":
      if (typeof payload !== "string") {
        return {
          ...state,
          notation: [...payload],
        };
      }
      return { ...state, notation: [...state.notation, payload] };

    case "SETHISTORY":
      return {
        ...state,
        history: payload,
      };

    case "SETCAPTURED":
      return { ...state, captured: payload };

    case "SETPING":
      return { ...state, ping: payload };

    case "SETCOLOR":
      return { ...state, color: payload };

    case "SETCHAT":
      return { ...state, chat: [...state.chat, ...payload] };

    case "SETTIMER":
      return { ...state, timer: payload };

    case "SETWHITEDISCONNECTTIMER":
      return { ...state, whiteDisconnectTimer: payload };

    case "SETBLACKDISCONNECTTIMER":
      return { ...state, blackDisconnectTimer: payload };

    case "SETONROOM":
      return { ...state, onRoom: payload };

    case "SETSELECTTIMER":
      return { ...state, selectTimer: payload };

    case "SETROOM":
      return { ...state, room: payload };

    case "SETISPLAYING":
      return { ...state, isPlaying: payload };

    case "SETREVENGE":
      return { ...state, revenge: payload };

    case "SETREVENGEOFFER":
      return { ...state, revengeOffer: payload };

    case "RESTARTBOARD":
      return { ...state, restart: !state.restart };

    case "SETBOARD":
      return { ...state, board: payload };

    case "SETPOSS":
      return { ...state, poss: payload };

    case "SETWINNER":
      return { ...state, winner: payload };

    case "SETSELECTED":
      return { ...state, selected: payload };

    case "SETADMIN":
      return { ...state, admin: payload };

    case "SETFEN":
      return { ...state, fen: payload };

    case "REMATCH":
      const color = state.player === payload.player1 ? "white" : "black";
      return { ...state, color };

    default:
      return { ...state };
  }
};

export default Reducer;
