import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Text, Input, Button, Spinner, Center } from "@chakra-ui/react";
import {
	FormControl,
	FormLabel,
	FormHelperText,
} from "@chakra-ui/react";
import {
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from "@chakra-ui/react";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem
} from "@chakra-ui/react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Appbar from "../Components/Appbar";

const CreateReel = () => {
	let API_URL;
	if(process.env.NODE_ENV !== "production") {
		API_URL=process.env.REACT_APP_DEV_API_URL;
	}
	else{
		API_URL=process.env.REACT_APP_PROD_API_URL;
	}

	const navigate = useNavigate();
	const toast = useToast();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const uid = JSON.parse(localStorage.getItem("reel-dump-user"));
	const access_token = JSON.parse(localStorage.getItem("reel-dump-access-token"));
	const reelLinkRef = useRef();
	const nameRef = useRef(null);

	const [category, setCategory] = useState("All");
	const [categories, setCategories] = useState();

	useEffect(() => {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${access_token}`);

		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow"
		};
		console.log(API_URL);
		fetch(`${API_URL}/reels/category/${uid}`, requestOptions)
			.then(response => response.json())
			.then((result) => {
				console.log(result);
				setCategories(result);
			})
			.catch((error) => {
				console.log("error", error);
			});
	},[]);

	const handleSubmit = (e) => {
		e.preventDefault();
		onOpen();
		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${access_token}`);
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			"uid": uid,
			"reel_link": reelLinkRef.current.value,
			"name": nameRef.current.value,
			"category": category
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch(`${API_URL}/reels/save`, requestOptions)
			.then(response => response.json())
			.then((result) => {
				console.log(result);
				if(result.status === "success") {
					toast({
						title: "Saved.",
						description: "Data saved successfully.",
						status: "success",
						duration: 9000,
						isClosable: true,
					});
					navigate("/");
				}
				else {
					toast({
						title: "Failure.",
						description: result.message,
						status: "error",
						duration: 9000,
						isClosable: true,
					});
				}
			})
			.catch((error) => {
				onClose();
				toast({
					title: "Failed to save.",
					description: "Something went wrong. Try again",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
				console.log("error", error);
			});
	};

	return (
		<Box>
			<Appbar/>
			<Container mt="10" maxW="container.md">
				<Text fontSize="2xl">New Reel</Text>
				<Text>Fill details to add a new reel.</Text>

				<form onSubmit={handleSubmit}>
					<FormControl mt="10">
						<FormLabel>Reel link</FormLabel>
						<Input ref={reelLinkRef} type='text' required/>
						<FormHelperText>Copy and paste reel link from instagram.</FormHelperText>
					</FormControl>

					<Accordion mt="6" allowToggle>
						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as="span" flex='1' textAlign='left'>
                                        Reel Name
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<FormControl>
									<Input ref={nameRef} type='text' required/>
									<FormHelperText>Provide a name for identification.</FormHelperText>
								</FormControl>
							</AccordionPanel>
						</AccordionItem>

						<AccordionItem>
							<h2>
								<AccordionButton>
									<Box as="span" flex='1' textAlign='left'>
                                        Reel category
									</Box>
									<AccordionIcon />
								</AccordionButton>
							</h2>
							<AccordionPanel pb={4}>
								<Menu>
									<MenuButton w="100%" as={Button} rightIcon={<ChevronDownIcon />}>
										{category}
									</MenuButton>
									<Text fontSize="xs">Select from your already existing categories.</Text>
									{categories &&
									<MenuList>
										{categories.data.map((data, idx) => (
											<MenuItem key={idx} onClick={() => setCategory(data.category)}>
												{data.category}
											</MenuItem>
										))}
									</MenuList>
									}
								</Menu>
								<FormControl mt="4">
									<Input onChange={(e) => setCategory(e.target.value)} type='text'/>
									<FormHelperText fontSize="xs">Provide name to create a new category.</FormHelperText>
								</FormControl>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>

					<Button type="submit" mt="5" size="lg" w='100%' colorScheme="teal">
                        Save Reel
					</Button>
				</form>

				<Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalBody py="10">
							<Center>
								<Spinner
									thickness='4px'
									speed='0.65s'
									emptyColor='gray.200'
									color='blue.500'
									size='xl'
								/>
							</Center>
							<Center>
								<Text mt="3">Saving data ...</Text> 
							</Center>
						</ModalBody>
					</ModalContent>
				</Modal>

			</Container>
		</Box>
	);
};
 
export default CreateReel;