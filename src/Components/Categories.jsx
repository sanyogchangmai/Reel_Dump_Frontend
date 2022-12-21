import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import {
	MenuList,
	MenuItem,
} from "@chakra-ui/react";

const Categories = () => {
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
			{categories &&
			<MenuList>
				{categories.data.map((data, idx) => (
					<MenuItem key={idx}>{data.category}</MenuItem>
				))}
			</MenuList>
			}
		</Box>
	);
};
 
export default Categories;