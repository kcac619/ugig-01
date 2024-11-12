// src/components/OnlineUserList.tsx
"use client";
import { useEffect, useState, useContext } from "react";

import { Box, VStack, Text, Heading, HStack, Button } from "@chakra-ui/react";
import { SocketContext } from "../ui/SocketProvider";
import { Toaster, toaster } from "../chakra/toaster";
interface OnlineUserProps {
  onlineUsers: string[];
  handleInvite: (username: string) => void; // Add handleInvite prop
}

const OnlineUsersList: React.FC<OnlineUserProps> = ({ handleInvite }) => {
  const { socket } = useContext(SocketContext);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const handleInviteClick = (userToInvite: string) => {
    // console.log("Inviting user:", userToInvite);
    handleInvite(userToInvite); // Call the provided handleInvite function
    socket.emit("test", { message: "Hello from client" });
    socket.on("testResponse", (data) => console.log("Server says:", data));
  };
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.emit("getOnlineUsers"); // Get initial user list
      });

      socket.on("inviteSent", (data: any) => {
        if (data.success) {
          toaster.create({
            title: `Invite sent to ${data.to}`,

            type: "success",
            duration: 3000,
          });
        } else if (data.error) {
          toaster.create({
            title: data.error,
            type: "error",
            duration: 3000,
          });
        }
      });
      socket.on("updateUserList", (users: any) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.off("connect");
        socket.off("invitesent");
        socket.off("updateUserList");
      };
    }
  }, [socket, toaster]);

  if (!socket)
    return (
      <>
        {" "}
        <Text>no socket detected yet</Text>
      </>
    );

  return (
    <>
      {/* <Box>
        <VStack rowGap={4} align="center">
          <Heading as="h2" size="lg">
            Online Users
          </Heading>

          <VStack rowGap={2} align="start">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user) => <Text key={user}>{user}</Text>)
            ) : (
              <Text>No users online</Text>
            )}
          </VStack>
        </VStack>
      </Box> */}
      <Box>
        <VStack rowGap={4} align="center">
          <Heading as="h2" size="lg">
            Online Users
          </Heading>

          <VStack rowGap={2} align="start">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user) => (
                <HStack key={user} justifyContent="space-between" width="200px">
                  <Text>{user}</Text>

                  <Button
                    onClick={() => handleInviteClick(user)} // Pass the user to invite
                    disabled={user === localStorage.getItem("username")} // Disable if inviting self
                    size="xs"
                    className="bg-white text-black px-2"
                  >
                    Invite
                  </Button>
                </HStack>
              ))
            ) : (
              <Text>No other users online</Text>
            )}
          </VStack>
        </VStack>
      </Box>
    </>
  );
};

export default OnlineUsersList;
