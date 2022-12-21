import "./App.css";
import { Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Reels from "./Pages/Reels";
import CreateReel from "./Pages/CreateReel";
import PrivateRoute from "./Pages/PrivateRoute";

function App() {
	return (
		<Box>
			<Router>
				<Routes>
					<Route exact path="/signup" element={<Signup />} />
					<Route exact path="/login" element={<Login />} />
					<Route
						exact
						path="/"
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path="/reels/:category"
						element={
							<PrivateRoute>
								<Reels />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path="/create/reel"
						element={
							<PrivateRoute>
								<CreateReel />
							</PrivateRoute>
						}
					/>
				</Routes>
			</Router>
		</Box>
	);
}

export default App;
