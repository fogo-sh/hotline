import React, { useRef, useEffect } from "react";

import { messageTypes } from "./consts";
import useHotlineClient from "./useHotlineClient";
import useChatInput from "./useChatInput";
import useWebsocket from "./useWebsocket";

import Admin from "./admin/Admin";

import "./App.css";

const CLIENT_ENDPOINT = "ws://localhost:2015/ws";

function App() {
  const { ws: clientWs, open: clientWsOpen } = useWebsocket(CLIENT_ENDPOINT);
  const { messages, sendMessage } = useHotlineClient(clientWs);

  const { input, onInputChange, onInputKeyPress } = useChatInput(sendMessage);

  const lastMessage = useRef();
  useEffect(() => {
    lastMessage.current?.scrollIntoView({ behaviour: "smooth" });
  });

  const renderMessage = ({ key, type, message }) => {
    switch (type) {
      case messageTypes.sent:
        return <p key={key}>{message}</p>;
      case messageTypes.received:
        return <p key={key}>{message}</p>;
      default:
        throw new Error(`unknown type: ${type}`);
    }
  };

  return (
    <div className="App">
      <Admin />
      <div className="ChatBox">
        <div className="ChatOutput">
          {messages.map(renderMessage)}
          <div ref={lastMessage} />
        </div>
        <input
          className="ChatInput"
          disabled={!clientWsOpen}
          value={input}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
        />
      </div>
    </div>
  );
}

export default App;
