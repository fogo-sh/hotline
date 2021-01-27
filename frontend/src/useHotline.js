import { useRef, useState, useEffect } from "react";

let messageId = 0;

export const messageTypes = Object.freeze({
  sent: "SENT",
  received: "RECEIVED",
});

export default function useHotline(endpoint) {
  const ws = useRef(null);

  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([]);

  const appendMessage = (message, type) => {
    messageId++;
    setMessages((prev) => [...prev, { key: messageId, message, type }]);
  };

  const sendMessage = (message) => {
    if (opened) {
      ws.current.send(message);
      appendMessage(message, messageTypes.sent);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(endpoint);

    window.ws = ws.current;

    ws.current.onopen = () => setOpened(true);
    ws.current.onclose = () => setOpened(false);

    ws.current.onmessage = (message) => {
      appendMessage(message, messageTypes.received);
    };

    return () => ws.current.close();
  }, [endpoint]);

  return {
    opened,
    messages,
    sendMessage,
  };
}
