import { Route, Routes } from "react-router-dom";
import { AppsPage } from "./pages/AppsPage";
import { TimelinePage } from "./pages/TimelinePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AppsPage />} />
      <Route path="/apps/:id" element={<TimelinePage />} />
    </Routes>
  );
}
