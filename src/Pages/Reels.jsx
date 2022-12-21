import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Text, SimpleGrid, Image, IconButton, Button, Input, Select, Center } from "@chakra-ui/react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import Appbar from "../Components/Appbar";
import Create from "../Components/Create";
import useFetchCategories from "../Hooks/useFetchcategories";

const Reels = () => {
	let API_URL;
	if(process.env.NODE_ENV !== "production") {
		API_URL=process.env.REACT_APP_DEV_API_URL;
	}
	else{
		API_URL=process.env.REACT_APP_PROD_API_URL;
	}

	const toast = useToast();

	const {categories} = useFetchCategories();
	const {category} = useParams();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [reels, setReels] = useState(null);
	const [newName, setNewName] = useState();
	const [rid, setRid] = useState();
	const [destination, setDestination] = useState();

	const uid = localStorage.getItem("reel-dump-user");
	const access_token = JSON.parse(localStorage.getItem("reel-dump-access-token"));

	useEffect(() => {
		console.log(category);
		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${access_token}`);

		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow"
		};

		fetch(`${API_URL}/reels/category/${category}/${uid}`, requestOptions)
			.then(response => response.json())
			.then((result) => {
				console.log(result);
				setReels(result);
			})
			.catch((error) => {
				console.log("error", error);
			});
	},[]);

	const handleMove = (e) => {
		e.preventDefault();
		console.log(rid);
		console.log(destination);
		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${access_token}`);
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			"category": destination
		});

		const requestOptions = {
			method: "PATCH",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch(`${API_URL}/reels/update/category/${rid}`, requestOptions)
			.then(response => response.json())
			.then((result) => {
				console.log(result);
				if(result.status === "success") {
					toast({
						title: "Moved.",
						description: "Moved successfully.",
						status: "success",
						duration: 9000,
						isClosable: true,
					});
					window.location.reload(false);
				}
				else {
					toast({
						title: "Failed to move.",
						description: result.message,
						status: "error",
						duration: 9000,
						isClosable: true,
					});
				}
			})
			.catch((error) => {
				console.log("error", error);
				toast({
					title: "Failed to move.",
					description: "Something went wrong. Try again.",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			});
	};

	const handleNameUpdate = (e) => {
		e.preventDefault();
		console.log(newName);

		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${access_token}`);
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			"name": newName
		});

		const requestOptions = {
			method: "PATCH",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch(`${API_URL}/reels/update/name/${rid}`, requestOptions)
			.then(response => response.json())
			.then((result) => {
				console.log(result);
				if(result.status === "success") {
					toast({
						title: "Success.",
						description: "Name updated successfully.",
						status: "success",
						duration: 9000,
						isClosable: true,
					});
					window.location.reload(false);
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
				console.log("error", error);
				toast({
					title: "Failure",
					description: "Something went wrong. Try again.",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			});
	};

	const handleSettings = (rid) => {
		onOpen();
		setRid(rid);
	};


	return (
		<Box>
			<Appbar/>
			<Container maxW="container.lg">
				<Box display="flex">
					<Box>
						<Text mt={["6", "8", "10"]} fontSize="2xl">
                            Saved Reels
						</Text>
						<Text>
                            Showing all reel categories
						</Text>
					</Box>
					<Box ml="auto" mt="10">
						<Create ml="auto"/>
					</Box>
				</Box>

				{reels &&
				<Center mt="20">
					{reels.data.length === 0 ? 
						<Text fontSize="md" color="red" fontWeight="500">Nothing to show here.</Text>
						: null}
				</Center>}

				<SimpleGrid mt="8" columns={[2, 3, 4]} spacing={["15px", "20px", "24px"]}>
					{reels &&
					<>
						{reels.data.map((data, idx) => (
							<Box key={idx} boxShadow="base" borderRadius="8px" height={["170px", "190px", "240px"]} _hover={{boxShadow: "md"}}>
								<a href={data.reel_link} target="_blank" rel="noopener noreferrer">
									<Box bg="#EDF2F7" borderTopLeftRadius="8px" borderTopRightRadius="8px" height={["130px", "150px", "200px"]}>
										<Image
											w="100%"
											height={["130px", "150px", "200px"]}
											objectFit='cover'
											src={data.thumbnail}
											borderTopLeftRadius="8px" borderTopRightRadius="8px"
										/>
									</Box>
								</a>
								<Box display='flex' bg="#FFFFFF" borderBottomLeftRadius="8px" borderBottomRightRadius="8px" height="10">
									<Text fontSize="xs" pt="2" ml="4">{data.name.substring(0,20) + "..."}</Text>
									<IconButton onClick={() => handleSettings(data.rid)} ml="auto" mt="1" mr="2" size={["xs", "sm"]} aria-label='Search database' icon={<SettingsIcon/>} />
								</Box>
							</Box>
						))}
					</>}
				</SimpleGrid>
				
				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Select category</ModalHeader>
						<ModalCloseButton />
						<ModalBody pb="10">
							<form onSubmit={handleNameUpdate}>
								<Text fontSize="xs">Rename reels</Text>
								<Input onChange={(e) => setNewName(e.target.value)} placeholder='New name' required/>
								<Button type="submit" mt="3" mb="5" w="100%" colorScheme='teal' size='md'>
                                Update name
								</Button>
							</form>

							<Text fontSize="xs">Select destination category</Text>
							{categories &&
							<Select placeholder='Select option' onChange={(e) => setDestination(e.target.value)}>
								{categories.data.map((data, idx) => (
									<option key={idx} value={data.category}>{data.category}</option>
								))}
							</Select>}
							<Button mt="3" onClick={handleMove} w="100%" colorScheme='teal' size='md'>
                                Move
							</Button>
						</ModalBody>
					</ModalContent>
				</Modal>
                
			</Container>
		</Box>
	);
};
 
export default Reels;