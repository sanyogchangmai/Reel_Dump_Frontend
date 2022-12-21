import { Box, IconButton } from "@chakra-ui/react";
import {Link} from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";

const Create = () => {
	return ( 
		<Box>
			<Link to="/create/reel">
				<IconButton variant='outline' colorScheme='teal' aria-label='Search database' icon={<AddIcon />} />
			</Link>
		</Box>
	);
};
 
export default Create;