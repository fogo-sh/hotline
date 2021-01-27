import React from "react";

import useHotline, { messageTypes } from "./useHotline";
import useChatInput from "./useChatInput";

import "./App.css";

const ENDPOINT = "ws://localhost:2015/ws";

function App() {
  const { opened, messages, sendMessage } = useHotline(ENDPOINT);
  const { input, onInputChange, onInputKeyPress } = useChatInput(sendMessage);

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
      <div className="ChatBox">
        <div className="ChatOutput">{messages.map(renderMessage)}</div>
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
