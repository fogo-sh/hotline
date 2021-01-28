import React, { useRef, useEffect } from "react";

import useHotline, { messageTypes } from "./useHotline";
import useChatInput from "./useChatInput";
import Admin from "./admin/Admin";

import "./App.css";

const ENDPOINT = "ws://localhost:2015/ws";

function App() {
  const { opened, messages, sendMessage } = useHotline(ENDPOINT);
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
          disabled={!opened}
          value={input}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
        />
      </div>
    </div>
  );
}

export default App;
