import React, { useRef, useState, useEffect } from "react";
import "./Admin.css";

function AdminChat({ uuid, onClick, focusedChat }) {
  const isFocused = uuid === focusedChat;
  return (
    <div className={isFocused ? "Focused Chat" : "Chat"} onClick={onClick}>
      {uuid}
    </div>
  );
}

export default function Admin() {
  const [open, setOpen] = useState();
  const [focusedChat, setFocusedChat] = useState("bruh");
  const input = useRef();

  useEffect(() => {
    if (open) {
      input.current.focus();
    }
  });

  const getChatProps = (uuid) => ({
    uuid,
    onClick: () => setFocusedChat(uuid),
    focusedChat,
  });

  const inputKeyDown = ({ key }) => {
    if (key === "Enter") {
      console.log("submit");
    }
  };

  useEffect(() => {
    const handler = ({ key }) => {
      if (key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  return (
    <div className={open ? "Container Open" : "Container"}>
      <div className="ViewerEditor">
        <div className="Viewer">
          <AdminChat {...getChatProps("bruh")} />
          <AdminChat {...getChatProps("shart")} />
          <AdminChat {...getChatProps("wockyslush")} />
          <AdminChat {...getChatProps("poop")} />
        </div>
        <div className="Editor">
          <input ref={input} onKeyDown={inputKeyDown} />
          <br />
          <button>📨Send</button>
          <button>🖕Close Connection</button>
          <button onClick={() => setOpen(false)}>👋Exit</button>
        </div>
      </div>
      <div className="PhoneIcon" onClick={() => setOpen(true)}>
        📞
      </div>
    </div>
  );
}
