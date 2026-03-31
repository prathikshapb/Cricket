import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import PointsTablePage from "./pages/PointsTablePage.tsx";
import MatchesPage from "./pages/MatchesPage.tsx";
import LiveScoresPage from "./pages/LiveScoresPage.tsx";
import RevealMatchPage from "./pages/RevealMatchPage.tsx";
import GroupPage from "./pages/GroupPage.tsx";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/live-scores" element={<LiveScoresPage />} />
      <Route path="/reveal-match" element={<RevealMatchPage />} />
      <Route path="/group" element={<GroupPage />} />
      <Route path="/points-table" element={<PointsTablePage />} />
      <Route path="/matches" element={<MatchesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
