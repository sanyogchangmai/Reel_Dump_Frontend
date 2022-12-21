import { Box, Container, Text, IconButton, Center, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

const Appbar = () => {
	const toast = useToast();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const navigate = useNavigate();

	const access_token = JSON.parse(localStorage.getItem("reel-dump-access-token"));

	const handleLogout = () => {
		localStorage.removeItem("reel-dump-access-token");
		toast({
			title: "Logged out.",
			description: "Logged out successfully.",
			status: "success",
			duration: 9000,
			isClosable: true,
		});
		navigate("/login");
	};

	return (
		<Box boxShadow="sm" py="3">
			<Container maxW="container.xl" display="flex">
				<Link to="/">
					<Text color="#FFA116" fontSize="lg" fontWeight="500">
					REELdump
					</Text>
				</Link>
				{access_token &&
				<Box ml="auto">
					<IconButton onClick={onOpen} variant='outline' colorScheme='red' size="sm" aria-label='Search database' icon={<SmallCloseIcon />} />
				</Box>}

				<Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Logout</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Center>
								<Text fontSize="xl">Do you want to logout?</Text>
							</Center>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
							</Button>
							<Button onClick={handleLogout} colorScheme='red' variant='solid'>
								Yes
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
	  
			</Container>
		</Box>
	);
};

export default Appbar;
