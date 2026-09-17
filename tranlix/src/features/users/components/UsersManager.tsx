import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import GroupIcon from "@mui/icons-material/Group";
import { useState } from "react";

import { useUsers } from "../hooks/useUsers";
import { useCreateUser } from "../hooks/useCreateUser";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function CreateUserDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateUser();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  const handleClose = () => {
    setUsername("");
    setFullName("");
    create.reset();
    onClose();
  };

  const handleSubmit = () => {
    create.mutate(
      { username: username.trim(), full_name: fullName.trim() },
      { onSuccess: handleClose }
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
        Thêm tài khoản mới
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />
          <TextField
            label="Họ tên"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            size="small"
          />
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Mật khẩu mặc định của tài khoản mới sẽ chính là tên đăng nhập.
          </Alert>
          {create.isError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {create.error?.message}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!username.trim() || !fullName.trim() || create.isPending}
          sx={{ borderRadius: 2 }}
        >
          {create.isPending ? <CircularProgress size={20} /> : "Tạo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function UsersManager() {
  const { data: users, isLoading } = useUsers();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GroupIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
            Quản trị tài khoản
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ borderRadius: 2, fontFamily: '"Lexend", sans-serif' }}
        >
          Thêm tài khoản
        </Button>
      </Box>

      {isLoading && <CircularProgress size={24} sx={{ alignSelf: "center" }} />}

      {!isLoading && (
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontWeight: 700,
                      backgroundColor: "neutral.50",
                      fontFamily: '"Lexend", sans-serif',
                      color: "text.secondary",
                      py: 1.5,
                    },
                  }}
                >
                  <TableCell>Tên đăng nhập</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày tạo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(users ?? []).map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ py: 1.5, fontFamily: "monospace", fontWeight: 500 }}>
                      {u.username}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>{u.full_name}</TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {u.is_admin ? (
                        <Chip label="Admin" size="small" color="primary" sx={{ fontWeight: 600 }} />
                      ) : (
                        <Chip label="Người dùng" size="small" variant="outlined" />
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={u.is_active ? "Hoạt động" : "Vô hiệu hóa"}
                        size="small"
                        color={u.is_active ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5, color: "text.secondary" }}>
                      {formatDate(u.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      <CreateUserDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Stack>
  );
}
