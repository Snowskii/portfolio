import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomeScreen from "./screens/HomeScreen.tsx";
import BangHomeScreen from "./screens/BangTheDuelGenerator/BangHomeScreen.tsx";
import GameGeneratorScreen from "./screens/BangTheDuelGenerator/GameGeneratorScreen.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen />,
  },
  {
    path: "/bangtheduelgenerator",
    element: <BangHomeScreen />,
  },
  {
    path: "/bangtheduelgenerator/game-generator",
    element: <GameGeneratorScreen />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
