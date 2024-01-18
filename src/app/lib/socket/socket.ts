import SockJS from "sockjs-client";
import Stomp, { Client, Frame } from "stompjs";
import FreemodeHandler from "../websocket/Freemode.socket/freemode.handler";

let stompClientFreemode: Client | null;
const stompClientMultiplayer: Client | null = Stomp.over(
  new SockJS("http://localhost:8080/secured/multiplayer")
);

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
function onConnectFreemode(frame: Frame | undefined) {
  if (!stompClientFreemode) return;
  let url = (stompClientFreemode.ws as any)._transport.url;

  url = url.replace("ws://localhost:8080/secured/freemode/", "");
  url = url.replace("/websocket", "");
  url = url.replace(/^[0-9]+\//, "");

  console.log(url);
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

export { stompClientFreemode, stompClientMultiplayer };
