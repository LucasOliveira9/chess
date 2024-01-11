"use client";

import { useEffect, useState } from "react";
import { FreemodeConnect, stompClientFreemode } from "./socket";

const WebsocketConnect = () => {
  useEffect(() => {
    FreemodeConnect();
  }, []);

  return null;
};

export default WebsocketConnect;
