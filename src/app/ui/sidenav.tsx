"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const listStyle = {
  padding: "2em",
  fontSize: "1.5rem",
  width: "100%",
};

const SideNav = () => {
  const path = usePathname();

  return (
    <main
      style={{
        height: "100vh",
        backgroundColor: "green",
        width: "100%",
        minWidth: "25em",
        position: "relative",
      }}
    >
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
        {path === "/multiplayer" && (
          <div style={{ position: "absolute", bottom: "15px" }}>Room</div>
        )}
      </div>
    </main>
  );
};

export default SideNav;
