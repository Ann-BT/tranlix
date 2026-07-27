import { Stack } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/components/Layout/Header";
import { UsersManager } from "@features/users";

export function AdminUsersPage() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Stack spacing={4} sx={{ py: 1 }}>
      <UsersManager />
    </Stack>
  );
}
