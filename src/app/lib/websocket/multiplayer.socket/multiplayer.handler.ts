import endGameStyles from "@/app/ui/styles/board/index.module.scss";
import { TAction } from "../../context/multiplayer.context/multiplayer.interface";

class MultiplayerHandler {
  static dispatch: React.Dispatch<TAction>;

  public static setDispatch(dispatch: React.Dispatch<TAction>) {
    this.dispatch = dispatch;
  }

  public static JoinStatus(response: any) {
    if (!MultiplayerHandler.dispatch) return;
    console.log(response);
    if (response.status) {
      localStorage.setItem("multiplayer", response.id);
      const enemie =
        response.player1 === response.player
          ? response.player2
          : response.player1;
      const color = response.player1 === response.player ? "white" : "black";
      const possible =
        response.player1 === response.player
          ? response.player1Moves
          : response.player2Moves;

      const poss = new Map();
      for (const i in possible) poss.set(i, possible[i]);

      MultiplayerHandler.dispatch({
        type: "SETONROOM",
        payload: true,
      });

      MultiplayerHandler.dispatch({
        type: "SETPOSS",
        payload: poss,
      });

      MultiplayerHandler.dispatch({
        type: "SETBOARD",
        payload: response.board,
      });

      MultiplayerHandler.dispatch({
        type: "SETROOM",
        payload: response.room,
      });

      MultiplayerHandler.dispatch({
        type: "SETCOLOR",
        payload: color,
      });

      MultiplayerHandler.dispatch({
        type: "SETPLAYER",
        payload: response.player,
      });

      MultiplayerHandler.dispatch({
        type: "SETCHAT",
        payload: response.chat,
      });

      MultiplayerHandler.dispatch({
        type: "SETENEMIE",
        payload: !enemie ? "Opponent" : enemie,
      });

      MultiplayerHandler.dispatch({
        type: "SETADMIN",
        payload: response.admin,
      });

      MultiplayerHandler.dispatch({
        type: "SETTIMER",
        payload: { white: response.timer, black: response.timer },
      });

      MultiplayerHandler.dispatch({
        type: "SETREVENGE",
        payload: false,
      });

      MultiplayerHandler.dispatch({
        type: "SETISPLAYING",
        payload: response.playing,
      });

      MultiplayerHandler.dispatch({
        type: "SETREVENGE",
        payload: response.revenge,
      });

      /*new MultiplayerSocketClientTest().setRoom(response.room);*/
    } else {
      MultiplayerHandler.dispatch({
        type: "SETONROOM",
        payload: false,
      });
    }
  }

  public static EnemieJoin(response: any) {
    if (!MultiplayerHandler.dispatch) return;
    MultiplayerHandler.dispatch({
      type: "SETENEMIE",
      payload: response,
    });

    MultiplayerHandler.dispatch({
      type: "SETREVENGE",
      payload: false,
    });
  }

  public static MessageReceived(response: any) {
    if (!MultiplayerHandler.dispatch) return;
    const index = response.length - 1;
    MultiplayerHandler.dispatch({
      type: "SETCHAT",
      payload: [response[index]],
    });
  }

  public static SetTimer(timer: number) {
    if (!MultiplayerHandler.dispatch) return;
    MultiplayerHandler.dispatch({
      type: "SETTIMER",
      payload: { white: timer, black: timer },
    });
    MultiplayerHandler.dispatch({
      type: "SETSELECTTIMER",
      payload: timer,
    });
  }

  public static Ping(data: any) {
    if (!MultiplayerHandler.dispatch) return;
    MultiplayerHandler.dispatch({
      type: "SETPING",
      payload: { white: data.player1, black: data.player2 },
    });
  }

  public static TimerUpdate(data: any) {
    if (!MultiplayerHandler.dispatch) return;
    MultiplayerHandler.dispatch({
      type: "SETTIMER",
      payload: { white: data.player1, black: data.player2 },
    });
  }

  public static AcceptDraw() {
    if (!MultiplayerHandler.dispatch) return;
    MultiplayerHandler.dispatch({
      type: "SETPOSS",
      payload: new Map(),
    });
    MultiplayerHandler.dispatch({
      type: "SETISPLAYING",
      payload: false,
    });
    document
      .getElementById("agreementDraw")
      ?.classList.remove(endGameStyles.none);
  }

  public static PlayerResign(data: any) {
    if (!MultiplayerHandler.dispatch) return;
    MultiplayerHandler.dispatch({
      type: "SETWINNER",
      payload: data.toLowerCase(),
    });

    MultiplayerHandler.dispatch({
      type: "SETPOSS",
      payload: new Map(),
    });

    MultiplayerHandler.dispatch({
      type: "SETISPLAYING",
      payload: false,
    });

    document.getElementById("gaveup")?.classList.remove(endGameStyles.none);
  }

  public static SetRematch(data: any) {
    if (!MultiplayerHandler.dispatch) return;
    const element = document.querySelectorAll(`.${endGameStyles.endgame}`);

    for (const i of element) i.classList.add(endGameStyles.none);
    const color = data.player1 === data.player ? "white" : "black";
    const possible =
      data.player1 === data.player ? data.player1Moves : data.player2Moves;

    MultiplayerHandler.dispatch({ type: "SETNOTATION", payload: [] });
    MultiplayerHandler.dispatch({ type: "SETCAPTURED", payload: [] });
    MultiplayerHandler.dispatch({
      type: "SETISPLAYING",
      payload: true,
    });
    MultiplayerHandler.dispatch({
      type: "SETREVENGEOFFER",
      payload: false,
    });
    MultiplayerHandler.dispatch({ type: "SETFEN", payload: data.fen });

    const poss = new Map();
    for (const i in possible) poss.set(i, possible[i]);

    MultiplayerHandler.dispatch({
      type: "SETBOARD",
      payload: data.board,
    });

    MultiplayerHandler.dispatch({
      type: "SETCOLOR",
      payload: color,
    });

    MultiplayerHandler.dispatch({ type: "RESTARTBOARD" });

    MultiplayerHandler.dispatch({
      type: "SETPOSS",
      payload: poss,
    });
    MultiplayerHandler.dispatch({ type: "SETWINNER", payload: "" });
  }

  public static UpdateDisconnectTimer(data: any) {
    if (!MultiplayerHandler.dispatch) return;
    const type =
      data.alliance.toLowerCase() === "white"
        ? "SETWHITEDISCONNECTTIMER"
        : "SETBLACKDISCONNECTTIMER";
    MultiplayerHandler.dispatch({
      type,
      payload: data.timer,
    });
  }

  public static playerDisconnected(response: any) {
    if (!MultiplayerHandler.dispatch) return;
    const index = response.chat.length - 1;
    const type =
      response.alliance.toLowerCase() === "white"
        ? "SETWHITEDISCONNECTTIMER"
        : "SETBLACKDISCONNECTTIMER";

    MultiplayerHandler.dispatch({
      type: "SETENEMIE",
      payload: "Opponent",
    });

    MultiplayerHandler.dispatch({
      type: "SETCHAT",
      payload: [response.chat[index]],
    });

    MultiplayerHandler.dispatch({
      type: "SETREVENGE",
      payload: false,
    });

    MultiplayerHandler.dispatch({
      type,
      payload: -1,
    });

    if (response.winner) {
      MultiplayerHandler.dispatch({
        type: "SETWINNER",
        payload: response.winner.toLowerCase(),
      });
      MultiplayerHandler.dispatch({
        type: "SETPOSS",
        payload: new Map(),
      });
      MultiplayerHandler.dispatch({
        type: "SETISPLAYING",
        payload: false,
      });

      document
        .getElementById("disconnectWin")
        ?.classList.remove(endGameStyles.none);
    }

    if (response.exchange) {
      MultiplayerHandler.dispatch({
        type: "SETCOLOR",
        payload: "white",
      });
    }
  }

  public static StopDisconnectTimer(alliance: string) {
    if (!MultiplayerHandler.dispatch) return;
    const type =
      alliance.toLowerCase() === "white"
        ? "SETWHITEDISCONNECTTIMER"
        : "SETBLACKDISCONNECTTIMER";
    MultiplayerHandler.dispatch({
      type,
      payload: -1,
    });
  }
}

export default MultiplayerHandler;
