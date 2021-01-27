import { useRef, useState, useEffect } from "react";

let messageId = 0;

export default function useHotline(endpoint) {
  const ws = useRef(null);

  const [opened, setOpened] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const appendMessage = ({ ours, message }) => {
    messageId++;
    setMessages((prev) => [...prev, { key: messageId, ours, message }]);
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:2015/ws");

    window.ws = ws.current;

    ws.current.onopen = () => setOpened(true);
    ws.current.onclose = () => setOpened(false);

    ws.current.onmessage = (message) => {
      appendMessage({ ours: false, message });
    };

    return () => ws.current.close();
  }, []);

  const onInputChange = (e) => setInput(e.target.value);
  const onInputKeyPress = (e) => {
    if (opened && e.key === "Enter") {
      ws.current.send(input);
      appendMessage({ ours: true, message: input });
      setInput("");
    }
  };

  return {
    opened,
    messages,
    input,
    onInputChange,
    onInputKeyPress,
  };
}
