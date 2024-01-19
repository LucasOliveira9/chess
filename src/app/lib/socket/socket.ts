import SockJS from "sockjs-client";
import Stomp, { Client, Frame } from "stompjs";
import FreemodeHandler from "../websocket/freemode.socket/freemode.handler";
import MultiplayerHandler from "../websocket/multiplayer.socket/multiplayer.handler";

let stompClientFreemode: Client | null;
let stompClientMultiplayer: Client | null;

export function FreemodeConnect() {
  stompClientFreemode = Stomp.over(
    new SockJS("http://localhost:8080/secured/freemode")
  );
  (stompClientFreemode as any).debug = null;
  stompClientFreemode.connect(
    { login: "", passcode: "" },
    onConnectFreemode,
    (error: string | Frame) => console.log(error)
  );
}

export function MultiplayerConnect() {
  stompClientMultiplayer = Stomp.over(
    new SockJS("http://localhost:8080/secured/multiplayer")
  );
  (stompClientMultiplayer as any).debug = null;
  stompClientMultiplayer.connect(
    { login: "", passcode: "" },
    onConnectMutiplayer,
    (error: string | Frame) => console.log(error)
  );
}

function onConnectFreemode(frame: Frame | undefined) {
  if (!stompClientFreemode) return;
  let url = (stompClientFreemode.ws as any)._transport.url;

  url = url.replace("ws://localhost:8080/secured/freemode/", "");
  url = url.replace("/websocket", "");
  url = url.replace(/^[0-9]+\//, "");

  stompClientFreemode.subscribe(
    "/user/queue/freemode/new_game",
    (data: any) => {
      const response = JSON.parse(data.body);
      FreemodeHandler.NewGame(response);
    }
  );

  stompClientFreemode.subscribe("/user/queue/freemode/restart", (data: any) => {
    const response = JSON.parse(data.body);
    FreemodeHandler.Restart(response);
  });

  stompClientFreemode.subscribe(
    "/user/queue/freemode/set_board",
    (data: any) => {
      const response = JSON.parse(data.body);
      FreemodeHandler.SetBoard(response);
    }
  );
}

export function newGame(id: string | null) {
  if (!stompClientFreemode) return;
  stompClientFreemode.send(
    "/chess/topic/freemode/new_game",
    {},
    JSON.stringify({ id })
  );
}

function onConnectMutiplayer(frame: Frame | undefined) {
  if (!stompClientMultiplayer) return;
  let url = (stompClientMultiplayer.ws as any)._transport.url;

  url = url.replace("ws://localhost:8080/secured/freemode/", "");
  url = url.replace("/websocket", "");
  url = url.replace(/^[0-9]+\//, "");

  stompClientMultiplayer.subscribe(
    "/user/queue/multiplayer/room/join_status",
    (data: any) => {
      const response = JSON.parse(data.body);
      MultiplayerHandler.JoinStatus(response);
    }
  );
}

export function Reconnect(id: string | null) {
  if (!stompClientMultiplayer) return;
  stompClientMultiplayer.send(
    `/chess/topic/multiplayer/room/reconnect`,
    {},
    JSON.stringify({ id, player: "", room: "" })
  );
}

export { stompClientFreemode, stompClientMultiplayer };
