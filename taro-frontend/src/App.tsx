import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ROUTE_PATHS } from "@/shared/config/router";
import MainPage from "@/pages/MainPage";
import RoomPage from "@/pages/RoomPage";
import NotFoundPage from "@/pages/NotFoundPage";
import { Suspense } from "react";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route
          path={ROUTE_PATHS.HOME}
          element={
            <Suspense fallback={""}>
              <MainPage />
            </Suspense>
          }
        />
        <Route
          path={ROUTE_PATHS.ROOM + ":id"}
          element={
            <Suspense fallback={""}>
              <RoomPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={""}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
