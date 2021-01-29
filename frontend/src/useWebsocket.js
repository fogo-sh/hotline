import { useEffect, useState } from "react";

export default function useWebsocket(endpoint) {
  const [ws, setWs] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const wsInner = new WebSocket(endpoint);
    wsInner.onopen = () => setOpen(true);
    wsInner.onclose = () => setOpen(false);
    setWs(wsInner);
    return () => wsInner.close();
  }, [endpoint]);

  return { ws, open };
}
