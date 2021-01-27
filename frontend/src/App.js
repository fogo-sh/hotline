import React, { useEffect } from "react";

import useHotline from "./useHotline";

import "./App.css";

function App() {
  const {
    opened,
    messages,
    input,
    onInputChange,
    onInputKeyPress,
  } = useHotline("ws://localhost:2015/ws");

  useEffect(() => {
    console.log({ opened });
  }, [opened]);

  return (
    <div className="App">
      <div className="ChatBox">
        <pre className="ChatOutput">
          {messages.map(({ key, ours, message }) => (
            <p key={key}>{message}</p>
          ))}
        </pre>
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
