import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import HomeScreen from "./screens/HomeScreen.tsx";
import BangHomeScreen from "./screens/BangTheDuelGenerator/BangHomeScreen.tsx";
import GameGeneratorScreen from "./screens/BangTheDuelGenerator/GameGeneratorScreen.tsx";
import LoveYouScreen from "./screens/LoveYouPage/LoveYouScreen.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/bangtheduelgenerator" element={<BangHomeScreen />} />
        <Route path="/bangtheduelgenerator/game-generator" element={<GameGeneratorScreen />} />
        <Route path="/loveyoupage" element={<LoveYouScreen />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
