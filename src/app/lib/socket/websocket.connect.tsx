"use client";

import { useEffect, useState } from "react";
import {
  FreemodeConnect,
  MultiplayerConnect,
  Reconnect,
  newGame,
  stompClientFreemode,
  stompClientMultiplayer,
} from "./socket";
import MultiplayerHandler from "../websocket/multiplayer.socket/multiplayer.handler";
import { useMultiplayerContext } from "../context/multiplayer.context/multiplayer.provider";
import { useFreemodeContext } from "../context/freemode.context/freemode.provider";
import FreemodeHandler from "../websocket/freemode.socket/freemode.handler";

const WebsocketConnect = () => {
  const [FConnected, setFConnected] = useState<boolean>(false);
  const [MConnected, setMConnected] = useState<boolean>(false);
  const MDispatch = useMultiplayerContext().dispatch;
  const FDispatch = useFreemodeContext().dispatch;

  useEffect(() => {
    MultiplayerHandler.setDispatch(MDispatch);
    FreemodeHandler.setDispatch(FDispatch);
    FreemodeConnect();
    MultiplayerConnect();
  }, []);

  useEffect(() => {
    if (!FConnected) {
      const interval: NodeJS.Timeout = setInterval(() => {
        if (stompClientFreemode?.connected) {
          Freemode(interval);
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (!MConnected) {
      const interval: NodeJS.Timeout = setInterval(() => {
        if (stompClientMultiplayer?.connected) {
          Multiplayer(interval);
        }
      }, 100);
    }
  }, []);

  function Freemode(interval: NodeJS.Timeout) {
    const id = localStorage.getItem("freemode");
    newGame(id);
    setFConnected(true);
    clearInterval(interval);
  }

  function Multiplayer(interval: NodeJS.Timeout) {
    const id = localStorage.getItem("multiplayer");
    Reconnect(id);
    setMConnected(true);
    clearInterval(interval);
  }

  return null;
};

export default WebsocketConnect;
