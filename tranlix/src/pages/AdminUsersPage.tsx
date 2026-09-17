import { Container, Stack } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/shared/components/Layout/Header";
import { UsersManager } from "@features/users";

export function AdminUsersPage() {
  const { user } = useAuth();

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={4}>
        <UsersManager />
      </Stack>
    </Container>
  );
}
