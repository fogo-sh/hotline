import { useState, useEffect } from "react";

import { messageTypes } from "./consts";

let messageId = 0;

export default function useHotlineClient(ws) {
  const [messages, setMessages] = useState([]);

  const appendMessage = (message, type) => {
    messageId++;
    setMessages((prev) => [...prev, { key: messageId, message, type }]);
  };

  const sendMessage = (message) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(message);
      appendMessage(message, messageTypes.sent);
    }
  };

  useEffect(() => {
    if (ws !== null) {
      window.__hotlineClient = ws;
      ws.onmessage = (message) => {
        appendMessage(message, messageTypes.received);
      };
    }
  }, [ws]);

  return {
    messages,
    sendMessage,
  };
}
