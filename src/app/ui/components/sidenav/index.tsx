"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "@/app/ui/styles/sidenav/index.module.scss";
import { useMultiplayerContext } from "@/app/lib/context/multiplayer.context/multiplayer.provider";

const listStyle = {
  padding: "2em",
  fontSize: "1.5rem",
  width: "100%",
};

const SideNav = () => {
  const { state } = useMultiplayerContext();
  const path = usePathname();

  return (
    <main className={styles.main}>
      <Link href="/">
        <div
          style={{ width: "100%", height: "30vh", backgroundColor: "gray" }}
        ></div>
      </Link>

      <div
        style={{
          padding: "1em",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <nav style={{ backgroundColor: "yellow" }}>
            <ul style={listStyle}>
              <Link href="/freemode">
                <li style={{ width: "100%" }}>Freemode</li>
              </Link>
              <Link href="/multiplayer">
                <li>Multiplayer</li>
              </Link>
            </ul>
          </nav>
        </div>
        {path === "/multiplayer" && state.onRoom ? (
          <div style={{ position: "absolute", bottom: "15px" }}>
            {state.room}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default SideNav;
