import { IState, TAction } from "./freemode.interface";

const Reducer = (state: IState, { type, payload }: TAction): IState => {
  switch (type) {
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

    case "SETFEN":
      return { ...state, fen: payload };

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

    case "SETCAPTURED":
      return { ...state, captured: payload };

    default:
      return { ...state };
  }
};

export default Reducer;
