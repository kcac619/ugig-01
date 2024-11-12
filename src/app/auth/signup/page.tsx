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
import { Toaster, toaster } from "../../../components/chakra/toaster";
import { Field } from "@/components/chakra/field";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/chakra/native-select";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // For more specific error display
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Get error details
        if (errorData.message) {
          setError(errorData.message); // Set specific error message
          toaster.create({
            title: errorData.message, // Display the server message
            type: "error",
            duration: 3000,
          });
        } else {
          setError("Signup failed."); // Generic message if no specific message is provided
          toaster.create({
            title: "Signup failed.",
            type: "error",
            duration: 3000,
          });
        }
        return;
      }

      // Signup successful
      toaster.create({
        title: "Account created.",
        description: "We've created your account for you.",
        type: "success",
        duration: 6000,
      });
      router.push("/auth/login"); // Redirect using next/navigation
    } catch (error) {
      // Handle unexpected errors
      setError("An unexpected error occurred.");
      toaster.create({
        title: "An unexpected error occurred.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="md" centerContent p={4}>
      <Toaster />
      <Heading as="h1" size="lg" mb={4}>
        Sign Up
      </Heading>

      <Box as="form" onSubmit={handleSubmit} width="100%">
        <Fieldset.Root size="lg" maxW="md">
          <Stack>
            <Fieldset.Legend>Sign Up</Fieldset.Legend>
            <Fieldset.HelperText>
              Please provide your details below.
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field label="Username" required>
              <Input
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>

            <Field label="Email address" required>
              <Input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>

            <Field label="Password" required>
              <Input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </Fieldset.Content>

          <Button
            type="submit"
            alignSelf="flex-start"
            colorScheme="teal"
            size="lg"
          >
            Sign Up
          </Button>
        </Fieldset.Root>
      </Box>
    </Container>
  );
}
