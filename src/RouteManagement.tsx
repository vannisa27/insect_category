import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import { Home } from "./pages/Home";

function RouteManagement() {
  return (
    <BrowserRouter basename="/insect_category">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default RouteManagement;
