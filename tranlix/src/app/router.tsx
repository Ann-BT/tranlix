import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@shared/components/Layout/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { JobsPage } from "@/pages/JobsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
