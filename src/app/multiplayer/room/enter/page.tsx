"use client";
import { useMultiplayerContext } from "@/app/lib/context/multiplayer.context/multiplayer.provider";
import MultiplayerSocket from "@/app/lib/websocket/multiplayer.socket/multiplayer.socket";
import styles from "@/app/ui/styles/enter/index.module.scss";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdMeetingRoom, MdRoomPreferences } from "react-icons/md";

const Page = () => {
  const [room, setRoom] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { state } = useMultiplayerContext();
  const router = useRouter();

  const SocketClient = new MultiplayerSocket();
  const handleJoinClick = () => {
    SocketClient.JoinRoom(room, user);
  };

  const handleCreateClick = () => {
    SocketClient.CreateRoom(room, user);
  };

  useEffect(() => {
    if (state.onRoom) router.push("/multiplayer/room/game");
  }, [state.onRoom]);
  return (
    <div className={styles.multiplayer__room}>
      <div className={styles.multiplayer__joinRoom}>
        <h3>User</h3>
        <input
          type="text"
          onChange={(e) => setUser(e.target.value)}
          maxLength={13}
          spellCheck="false"
          minLength={5}
          required
        />

        <h3>Room</h3>
        <input
          type="text"
          onChange={(e) => setRoom(e.target.value)}
          spellCheck="false"
          minLength={5}
          required
        />

        <h3>Password</h3>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
        />

        <div className={styles.multiplayer__joinIconsContainer}>
          <MdRoomPreferences
            onClick={handleCreateClick}
            title="Create Room"
            className={styles.multiplayer__joinIcons}
          />
          <MdMeetingRoom
            onClick={handleJoinClick}
            title="Join Room"
            className={styles.multiplayer__joinIcons}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
