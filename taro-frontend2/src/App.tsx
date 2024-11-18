import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/config/router";
import MainPage from "@/pages/MainPage";
import RoomPage from "@/pages/RoomPage";
import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path={ROUTE_PATHS.HOME} element={<MainPage />} />
        <Route path={ROUTE_PATHS.ROOM + ":id"} element={<RoomPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
