import { useState } from "react";

export default function useChatInput(sendMessage) {
  const [input, setInput] = useState("");

  const onInputChange = (e) => setInput(e.target.value);
  const onInputKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage(input);
      setInput("");
    }
  };

  return { input, onInputChange, onInputKeyPress };
}
