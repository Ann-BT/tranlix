import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@shared/components/Layout/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { JobsPage } from "@/pages/JobsPage";
import { ComparePage } from "@/pages/ComparePage";
import { GlossaryPage } from "@/pages/GlossaryPage";
import { AdminUsersPage } from "@/pages/AdminUsersPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LoginPage } from "@/pages/LoginPage";

export function AppRouter() {
  return (
    <Routes>
      {/* Login page (no layout) */}
      <Route path="/login" element={<LoginPage />} />

      {/* App layout with Header/Footer */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="history" element={<JobsPage />} />
        <Route path="compare/:jobId" element={<ComparePage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="admin/users" element={<AdminUsersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
