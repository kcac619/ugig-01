// src/app/play/page.tsx
"use client";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
// import { io } from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import GameGrid from "../../components/ui/Grid";
import OnlineUsersList from "../../components/ui/OnlineUsersList";
import {
  SocketContext,
  SocketProvider,
} from "../../components/ui/SocketProvider";
import { Toaster, toaster } from "@/components/chakra/toaster";

export default function Play() {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string | null>(null);

  const [selectedCells, setSelectedCells] = useState<Record<string, string>>(
    {}
  );
  const [invitationSent, setInvitationSent] = useState(false);
  const [receivedInvite, setReceivedInvite] = useState<{
    from: string;
  } | null>(null);
  const [opponentUsername, setOpponentUsername] = useState<string | null>(null);

  const { socket } = useContext(SocketContext);
  console.log("play page socket", socket);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
        socket.emit("getOnlineUsers"); // Get initial user list
      });

      socket.on("updateUserList", (users: any) => {
        const otherUsers = users.filter(
          (user: any) => user !== localStorage.getItem("username")
        );
        setOnlineUsers(otherUsers); // Update state with other users
      });
      socket.on("joinedRoom", (data) => {
        setRoomId(data.roomId);
        console.log("Joined room:", data.roomId);
      });
      socket.on("receiveInvite", (data) => {
        console.log("Received invite from:", data.from);
        setReceivedInvite(data); // Set receivedInvite state
        toaster.create({
          title: `Received invite from ${data.from}`,
          type: "info",
          duration: 10000,
        });
      });
      socket.on("joinedRoom", (data) => {
        setRoomId(data.roomId);
        if (receivedInvite && receivedInvite.from) {
          setOpponentUsername(receivedInvite.from); // Set opponent username when joining a room via invite
        } else if (invitationSent) {
          // if you are the one who sent the invitation

          setOpponentUsername((prevOpponent) => {
            if (prevOpponent) return prevOpponent; // keeps the previous username if available

            if (onlineUsers.length) return onlineUsers[0]; // keeps the first player in the onlineUserList as the opponent

            return null; // return null if no opponent found
          });
        }
        console.log("Joined room:", data.roomId);

        toaster.create({
          title: `Joined Room`,
          description: `Room ID :  ${data.roomId}`,
          type: "info",
          duration: 9000,
        });
      });
      socket.on("cellSelected", (data: any) => {
        console.log(`Client ${data.username} selected cell ${data.cell}`);

        setSelectedCells((prev) => ({ ...prev, [data.cell]: data.username }));
      });

      return () => {
        socket.off("connect");
        socket.off("updateUserList");
        socket.off("receiveInvite"); // Remove this listener too
        socket.off("joinedRoom");
        socket.off("cellSelected");
      };
    }
  }, [socket, toaster, receivedInvite, invitationSent, onlineUsers]);

  const handleInvite = (userToInvite: string) => {
    console.log("Inviting user:", userToInvite);
    console.log("socket before sendinvite", socket || "no socket");
    if (socket && localStorage.getItem("username")) {
      socket.emit("sendInvite", { to: userToInvite }); // Correct event name
      console.log(`Sending invite to ${userToInvite}`);
      setInvitationSent(true);
    }
  };
  const handleAcceptInvite = () => {
    if (socket && receivedInvite) {
      console.log("Accepting invite from:", receivedInvite.from);
      socket.emit("acceptInvite", receivedInvite); // Emit acceptInvite with payload
      setInvitationSent(false);
    }
  };
  const handleJoinRoom = (roomId: string) => {
    if (socket) {
      console.log("Joining room", roomId);
      socket.emit("joinRoom", { roomId });
    }
  };

  const handleCellClick = (cell: string) => {
    if (socket && roomId) {
      socket.emit("selectCell", cell);
      console.log("Cell clicked:", cell);
    }
  };

  return (
    <SocketProvider>
      <Box>
        <Container maxW="container.xl" centerContent>
          <Toaster />
          <VStack rowGap={8} align="center">
            {/* Conditionally render sections based on game state */}
            {!roomId && ( // Show online users and invite controls if not in a room
              <>
                <OnlineUsersList
                  onlineUsers={onlineUsers}
                  handleInvite={handleInvite}
                />

                {/* Show accept invite button if an invite has been received */}

                {receivedInvite && (
                  <Button
                    onClick={handleAcceptInvite}
                    disabled={!receivedInvite}
                  >
                    Accept Invite from {receivedInvite?.from}
                  </Button>
                )}
              </>
            )}

            {roomId && opponentUsername ? ( // Render game if in a room
              <>
                <Heading size="md">
                  Playing with: {opponentUsername} (Room: {roomId})
                </Heading>

                <GameGrid
                  handleCellClick={handleCellClick}
                  selectedCells={selectedCells}
                />
              </>
            ) : (
              <Text>Waiting to Create or Join a room...</Text>
            )}
          </VStack>
        </Container>
      </Box>{" "}
    </SocketProvider>
  );
}
