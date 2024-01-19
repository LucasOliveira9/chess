import { stompClientMultiplayer } from "../../socket/socket";
import Move from "../../utils/move";
import MultiplayerHandler from "./multiplayer.handler";

class MultiplayerSocket {
  public static Subscribed = false;
  public static room = null;
  public static sessionId = null;
  public static Move({
    from,
    to,
    promotion,
  }: {
    from: string;
    to: string;
    promotion: string | null;
  }) {
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${MultiplayerSocket.room}/move`,
      {},
      JSON.stringify({ from, to, promotion })
    );
  }

  public Subscribe(room: string) {
    if (MultiplayerSocket.Subscribed) return;

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/receive_message`,
      (data: any) => {
        const response = JSON.parse(data.body);
        MultiplayerHandler.MessageReceived(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/stop_disconnect_timer`,
      (data: any) => {
        const alliance = data.body;
        MultiplayerHandler.StopDisconnectTimer(alliance);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/game_timer_updated`,
      (data: any) => {
        const response = data.body;
        MultiplayerHandler.SetTimer(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/enemie_moved`,
      (data: any) => {
        const response = JSON.parse(data.body);
        const sqr = document
          .getElementById(response.to)
          ?.querySelector(".image");
        const currSqr = document
          .getElementById(response.from)
          ?.querySelector(".image");
        const piece = currSqr?.querySelector("img");
        if (piece && response.status) Move(response, "Multi", undefined);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/update_timer`,
      (data: any) => {
        const response = JSON.parse(data.body);
        MultiplayerHandler.TimerUpdate(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/update_disconnectTimer`,
      (data: any) => {
        const response = JSON.parse(data.body);
        MultiplayerHandler.UpdateDisconnectTimer(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/player_disconnected`,
      (data: any) => {
        const response = JSON.parse(data.body);
        MultiplayerHandler.playerDisconnected(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/rematch_offer_received`,
      () => {
        const element = document.getElementById("revengeDecision");
        const parent = element?.parentElement;
        element && (element.style.display = "flex");
        parent && (parent.scrollTop = element.offsetTop);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/set_rematch`,
      (data: any) => {
        const response = JSON.parse(data.body);
        MultiplayerHandler.SetRematch(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/rematch_offer_canceled`,
      () => {
        const element = document.getElementById("revengeDecision");
        element && (element.style.display = "none");
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/draw_offer_canceled`,
      () => {
        const element = document.getElementById("draw_offer");
        element && (element.style.display = "none");
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/draw_offer_received`,
      () => {
        const Element = document.getElementById("draw_offer");
        const Parent = Element?.parentElement;
        Element && (Element.style.display = "flex");
        Parent && (Parent.scrollTop = Element.offsetTop);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/agreement_draw`,
      () => MultiplayerHandler.AcceptDraw()
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/rematch_rejected`,
      () => {
        const element = document.getElementById("revengeDecision");
        element && (element.style.display = "none");
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/player_resign`,
      (data: any) => {
        const response = data.body;
        MultiplayerHandler.PlayerResign(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/game_started`,
      () => {
        MultiplayerHandler.dispatch({
          type: "SETISPLAYING",
          payload: true,
        });

        MultiplayerHandler.dispatch({
          type: "SETREVENGE",
          payload: true,
        });
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/ping`,
      (data: any) => {
        const response = data.body;
        const dt = Date.now() - +response;
        stompClientMultiplayer?.send(
          `/chess/topic/multiplayer/room/${room}/update_ping_server`,
          {},
          dt.toString()
        );
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/update_ping_user`,
      (data: any) => {
        const response = JSON.parse(data.body);
        MultiplayerHandler.Ping(response);
      }
    );

    stompClientMultiplayer?.subscribe(
      `/topic/multiplayer/room/${room}/${MultiplayerSocket.sessionId}/enemie_join`,
      (data: any) => {
        MultiplayerHandler.EnemieJoin(data.body);
      }
    );

    MultiplayerSocket.Subscribed = true;
  }

  public JoinRoom(room: string, name: string) {
    if (!stompClientMultiplayer || room === "" || name === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/join_room`,
      {},
      JSON.stringify({ room, player: name })
    );
  }

  public StartGame(room: string) {
    if (!stompClientMultiplayer || room === "") return;

    stompClientMultiplayer?.send(`/chess/topic/multiplayer/room/${room}/start`);

    MultiplayerHandler.dispatch({
      type: "SETISPLAYING",
      payload: true,
    });

    MultiplayerHandler.dispatch({
      type: "SETREVENGE",
      payload: true,
    });
  }

  public CreateRoom(room: string, name: string) {
    if (!stompClientMultiplayer || room === "" || name === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/create_room`,
      {},
      JSON.stringify({ room, player: name })
    );
  }

  public SetTimer(room: string, timer: number) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/update_game_timer`,
      {},
      timer.toString()
    );
  }

  public Message(room: string, message: string) {
    if (!stompClientMultiplayer || room === "" || message === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/message`,
      {},
      JSON.stringify({ message })
    );
  }

  public RematchOffer(room: string) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/offer_rematch`
    );
  }

  public DrawOffer(room: string) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/offer_draw`
    );
  }

  public AcceptDraw(room: string) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/accept_draw`
    );
    const element = document.getElementById("draw_offer");
    element && (element.style.display = "none");
  }

  public AcceptRematch(room: string) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/accept_rematch`
    );
    const element = document.getElementById("revengeDecision");
    element && (element.style.display = "none");
  }

  public RejectRematch(room: string) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/reject_rematch`
    );
    const element = document.getElementById("revengeDecision");
    element && (element.style.display = "none");
  }

  public CancelRematchOffer(room: string) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/cancel_rematch_offer`
    );
  }

  public Resign(room: string) {
    if (!stompClientMultiplayer || room === "") return;
    stompClientMultiplayer?.send(
      `/chess/topic/multiplayer/room/${room}/resign`
    );
  }
}

export default MultiplayerSocket;
