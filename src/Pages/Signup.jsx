import {useRef, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Input, Button, Text, Center } from "@chakra-ui/react";
import {
	FormControl,
	FormLabel,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import Appbar from "../Components/Appbar";
  
const Signup = () => {
	let API_URL;
	if(process.env.NODE_ENV !== "production") {
		API_URL=process.env.REACT_APP_DEV_API_URL;
	}
	else{
		API_URL=process.env.REACT_APP_PROD_API_URL;
	}

	const navigate = useNavigate();
	const toast = useToast();

	const [btnText, setBtnText] = useState("Create account");
	const emailRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();

	const handleSignup = (e) => {
		e.preventDefault();
		setBtnText("Creating account...");
		if(passwordRef.current.value !== confirmPasswordRef.current.value) {
			toast({
				title: "Passwords do not match",
				description: "Please provide same password",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			"email": emailRef.current.value,
			"password": passwordRef.current.value
		});

		const requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: raw,
			redirect: "follow"
		};

		fetch(`${API_URL}/auth/signup`, requestOptions)
			.then(response => response.json())
			.then((result) => {
				if(result.status === "success") {
					console.log(result);
					toast({
						title: "Authenticated.",
						description: "Logged in successfully.",
						status: "success",
						duration: 9000,
						isClosable: true,
					});
					navigate("/login");
				}
				else {
					setBtnText("Login");
					toast({
						title: "Failed to create account.",
						description: result.message,
						status: "error",
						duration: 9000,
						isClosable: true,
					});
				}
			})
			.catch((error) => {
				setBtnText("Login");
				console.log("error", error);
				toast({
					title: "Failed to create account.",
					description: "Something went wrong. Try again.",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			});
	};

	return (
		<Box>
			<Appbar/>
			<Container maxW="container.sm" px={["6", "8", "12"]}>
				<Box mt="10">
					<Text fontSize={["2xl", "3xl"]}>Create account</Text>
					<Text>Enter your details to continue</Text>
					<form onSubmit={handleSignup}>
						<FormControl mt="8">
							<FormLabel fontWeight="400">Email</FormLabel>
							<Input ref={emailRef} size="lg" type="email" placeholder="Enter your email" />
						</FormControl>

						<FormControl mt="6">
							<FormLabel fontWeight="400">Password</FormLabel>
							<Input ref={passwordRef} size="lg" type="password" placeholder="Password" />
						</FormControl>

						<FormControl mt="6">
							<FormLabel fontWeight="400">Confirm Password</FormLabel>
							<Input ref={confirmPasswordRef} size="lg" type="password" placeholder="Enter password again" />
						</FormControl>

						<Button type="submit" size="lg" mt="6" w="100%" colorScheme="teal">
							{btnText}
						</Button>
					</form>
					<Center mt="3">
						<Text>Already have account ? </Text>
						<Link to="/login">
							<Text color="#255DF2" ml="1">Login</Text>
						</Link>
					</Center>
				</Box>
			</Container>
		</Box>
	);
};
 
export default Signup;