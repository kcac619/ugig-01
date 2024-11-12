// components/SocketProvider.tsx
"use client";
import { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
});

interface SocketProviderProps {
  children: React.ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    setToken(storedToken);

    if (storedToken) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game`, {
        extraHeaders: {
          Authorization: `Bearer ${storedToken}`, // Use storedToken directly
        },
      });

      console.log("newSocket", newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to server");

        // Move the test emit and listener here *after* successful connection
        newSocket.emit("test", { message: "Hello from client" });

        newSocket.on("testResponse", (data) =>
          console.log("Server says:", data)
        );
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    }
  }, []);
  // useEffect(() => {
  //   console.log("socket test 2", socket);
  //   if (socket) {
  //     socket.emit("test", { message: "Hello from client" });
  //     socket.on("testResponse", (data) => console.log("Server says:", data));
  //   }
  // }, [socket]);
  // useEffect(() => {
  //   const storedToken = localStorage.getItem("token");
  //   setToken(storedToken); // Set initial token state

  //   createSocketConnection(storedToken); // Create initial connection if token exists

  //   return () => {
  //     socket?.disconnect();
  //     socketRef.current = null;
  //     setSocket(null);
  //   };
  // }, []);

  // Recreate connection when token changes
  // useEffect(() => {
  //   createSocketConnection(token); // Create connection (or disconnect if token is null)

  //   return () => {
  //     socket?.disconnect();
  //     socketRef.current = null;
  //     setSocket(null);
  //   };
  // }, [token]);

  // useEffect(() => {
  //   const handleStorageChange = () => {
  //     const newToken = localStorage.getItem("token");
  //     console.log("newToken", newToken);

  //     setToken(newToken);
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
