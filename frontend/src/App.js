import React, { useRef, useState, useEffect } from 'react';

import "./App.css";

let messageId = 0;

function App() {
  const ws = useRef(null);

  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const appendMessage = ({ ours, message }) => {
    messageId++;
    console.log({ours, message});
    setMessages((prev) => [...prev, { key: messageId, ours, message }]);
  };

  const onInputChange = (e) => setInput(e.target.value);
  const onInputKeyPress = (e) => {
    if (opened && e.key === 'Enter') {
      ws.current.send(input);
      appendMessage({ ours: true, message: input });
      setInput('');
    }
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:2015/ws");

    window.ws = ws.current;

    ws.current.onopen = () => setOpened(true);
    ws.current.onclose = () => setOpened(false);
    ws.current.onmessage = (message) => appendMessage({ ours: false, message });

    return () => ws.current.close();
  }, []);

  useEffect(() => {
    console.log({opened});
  }, [opened]);

  return (
    <div className="App">
      <div className="ChatBox">
        <pre className="ChatOutput">
          {messages.map(({key, ours, message}) => (
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
