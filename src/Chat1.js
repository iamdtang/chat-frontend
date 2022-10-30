import { useEffect, useState, useRef } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const webSocketRef = useRef(null);

  useEffect(() => {
    webSocketRef.current = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    webSocketRef.current.onclose = () => {
      console.error("WebSocket disconnected");
    };

    webSocketRef.current.onerror = (error) => {
      console.error("WebSocket failed to connect", error);
    };

    webSocketRef.current.onmessage = (event) => {
      const blob = event.data;
      blob.text().then((message) => {
        console.log("WebSocket received");

        // this won't work, as messages is [] via closure
        // setMessages(messages.concat(message));

        setMessages((messages) => [...messages, message]);
      });
    };

    return () => {
      webSocketRef.current.close();
    };
  }, []);

  return (
    <div>
      <ul id="chat">
        {messages.map((message) => {
          return <li key={message}>{message}</li>;
        })}
      </ul>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          webSocketRef.current.send(message);
          setMessage("");
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
