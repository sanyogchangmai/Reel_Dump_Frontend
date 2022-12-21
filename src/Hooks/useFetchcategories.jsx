import { useEffect, useState } from "react";

const useFetchCategories = () => {
	let API_URL;
	if(process.env.NODE_ENV !== "production") {
		API_URL=process.env.REACT_APP_DEV_API_URL;
	}
	else{
		API_URL=process.env.REACT_APP_PROD_API_URL;
	}

	const uid = localStorage.getItem("reel-dump-user");
	const access_token = JSON.parse(localStorage.getItem("reel-dump-access-token"));
	const [categories, setCategories] = useState(null);
	
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
	return {categories};
};
 
export default useFetchCategories;