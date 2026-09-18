import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@shared/components/Layout/AppLayout";
import { ProtectedRoute } from "@/app/ProtectedRoute";
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

        {/* Authenticated Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="history" element={<JobsPage />} />
          <Route path="compare/:jobId" element={<ComparePage />} />
          <Route path="glossary" element={<GlossaryPage />} />
        </Route>

        {/* Admin-only Routes */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="admin/users" element={<AdminUsersPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
