import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Container, Text, SimpleGrid, Center } from "@chakra-ui/react";
import Appbar from "../Components/Appbar";
import Create from "../Components/Create";

const Home = () => {
	let API_URL;
	if(process.env.NODE_ENV !== "production") {
		API_URL=process.env.REACT_APP_DEV_API_URL;
	}
	else{
		API_URL=process.env.REACT_APP_PROD_API_URL;
	}

	const [categories, setCategories] = useState(null);

	const uid = localStorage.getItem("reel-dump-user");
	const access_token = JSON.parse(localStorage.getItem("reel-dump-access-token"));

	useEffect(() => {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${access_token}`);

		const requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow"
		};

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

				{categories &&
				<Center mt="20">
					{categories.data.length === 0 ? 
						<Text fontSize="md" color="red" fontWeight="500">Nothing to show here.</Text>
						: null}
				</Center>}

				<SimpleGrid mt="8" columns={[2, 3, 4]} spacing={["15px", "20px", "24px"]}>
					{categories &&
					<>
						{categories.data.map((data, idx) => (
							<Link key={idx} to={`/reels/${data.category}`}>
								<Box boxShadow="base" borderRadius="8px" height={["170px", "190px", "240px"]} _hover={{boxShadow: "md"}}>
									<Box bg="#EDF2F7" borderTopLeftRadius="8px" borderTopRightRadius="8px" height={["130px", "150px", "200px"]}></Box>
									<Box bg="#FFFFFF" borderBottomLeftRadius="8px" borderBottomRightRadius="8px" height="10">
										<Text pt="2" ml="4">{data.category ? data.category.toUpperCase() : "All"}</Text>
									</Box>
								</Box>
							</Link>
						))}
					</>}
				</SimpleGrid>

			</Container>
		</Box>
	);
};
 
export default Home;