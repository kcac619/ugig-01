"use client"; // This is crucial for client-side components

import {
  Heading,
  Box,
  Button,
  VStack,
  Container,
  Input,
  Stack,
  Fieldset,
} from "@chakra-ui/react";
import { Field } from "@/components/chakra/field";
import { InputGroup } from "@/components/chakra/input-group";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { FaUser, FaLock } from "react-icons/fa";
import { Toaster, toaster } from "@/components/chakra/toaster";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // For more specific error display
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Get error details
        if (errorData.message) {
          setError(errorData.message); // Set specific error message
          toaster.create({
            title: errorData.message, // Display the server message
            type: "error",
          });
        } else {
          setError("Login failed."); // Generic message if no specific message is provided
          toaster.create({
            title: "Login failed.",
            type: "error",
          });
        }
        return;
      }

      // Login successful
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      console.log(data);
      toaster.create({
        title: "Login successful.",
        description: "You have successfully logged in.",
        type: "success",
      });
      router.push("/play"); // Redirect using next/navigation
    } catch (error) {
      // Handle unexpected errors
      setError("An unexpected error occurred.");
      toaster.create({
        title: "An unexpected error occurred.",
        type: "error",
      });
    }
  };

  return (
    <Container
      maxW="md"
      centerContent
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
      <Toaster />
      <VStack rowGap={4} align="center" width="100%">
        <Heading as="h1" size="lg" mb={4}>
          Login
        </Heading>

        <Box as="form" onSubmit={handleSubmit} width="100%">
          <Fieldset.Root size="lg" maxW="md">
            <Stack rowGap={4}>
              {/* <Fieldset.Legend>Login</Fieldset.Legend> */}
              <Fieldset.HelperText>
                Please provide your login details below.
              </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content>
              <Field label="Username" required>
                <InputGroup flex="1" startElement={<FaUser />}>
                  <Input
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </InputGroup>
              </Field>

              <Field label="Password" required>
                <InputGroup flex="1" startElement={<FaLock />}>
                  <Input
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </InputGroup>
              </Field>
            </Fieldset.Content>

            <Button
              type="submit"
              alignSelf="flex-start"
              colorScheme="teal"
              size="lg"
              mt={4}
            >
              Login
            </Button>
          </Fieldset.Root>
        </Box>
      </VStack>
    </Container>
  );
}
