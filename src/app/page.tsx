"use client";

import {
  Box,
  Container,
  Heading,
  HStack,
  Button,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import OnlineUsers from "../components/ui/OnlineUsers";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/chakra/drawer";
import { useRouter } from "next/navigation";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { FaBars } from "react-icons/fa";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({ subsets: ["latin"] });
export default function Home() {
  const [open, setOpen] = useState(false);
  const [init, setInit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const particlesOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "#000000",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: true,
        },
        modes: {
          push: {
            quantity: 2,
          },
          repulse: {
            distance: 100,
            duration: 0.2,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 100,
          enable: true,
          opacity: 0.6,
          width: 0.5,
        },
        collisions: {
          enable: true,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 40,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  const handleLaunchGame = () => {
    router.push("/play");
    console.log("Launching game...");
  };

  return (
    <Box minH="100vh" position="relative" overflow="hidden">
      <Container maxW="90%" p={4} position="relative" zIndex={1}>
        {init && (
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={particlesOptions}
          />
        )}
        <Flex justifyContent="space-between" alignItems="center">
          <DrawerRoot
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            placement={"start"}
          >
            <DrawerBackdrop />
            <DrawerTrigger asChild>
              <Button variant="outline" size="sm" colorScheme="gray">
                <FaBars />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
              </DrawerHeader>
              <DrawerBody>
                <VStack rowGap={4} align="start">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      colorScheme="gray"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button colorScheme="gray" onClick={() => setOpen(false)}>
                      Sign Up
                    </Button>
                  </Link>
                </VStack>
              </DrawerBody>
              <DrawerFooter>
                <DrawerActionTrigger asChild>
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                </DrawerActionTrigger>
              </DrawerFooter>
              <DrawerCloseTrigger />
            </DrawerContent>
          </DrawerRoot>

          <Heading
            as="h1"
            size="xl"
            textAlign="center"
            flexGrow={1}
            fontFamily={"Roboto"}
            fontSize={{ base: "2xl", md: "3xl" }}
            color="white"
          >
            UGIG
          </Heading>

          <HStack columnGap={4} display={{ base: "none", md: "flex" }}>
            <Link href="/auth/login">
              <Button variant="ghost" colorScheme="gray">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button colorScheme="gray">Sign Up</Button>
            </Link>
          </HStack>
        </Flex>

        <Flex
          direction="column"
          align="center"
          justify="center"
          minH="80vh"
          mt={12}
        >
          <VStack
            rowGap={20}
            align="center"
            css={{
              zIndex: 1000,
            }}
          >
            <div style={{ right: "50px" }}>
              <Image
                src={"/gamelogo.gif"}
                style={{ right: "50px" }}
                alt="Game Logo"
                width={200}
                height={300}
              />
            </div>
            <Box
              as={Button}
              className={` bg-gradient-to-r from-gray-700 to-gray-900 px-4 `}
              // size="lg"
              onClick={handleLaunchGame}
              animation="glow 1.5s infinite"
              _hover={{
                animation: "none",
              }}
              color="WHITE"
              px={10}
              py={5}
            >
              LAUNCH GAME
            </Box>
            {/* <OnlineUsers /> */}
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
}
