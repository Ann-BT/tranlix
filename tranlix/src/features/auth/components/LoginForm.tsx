import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

import { useLogin } from "../hooks/useAuth";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        login.mutate({username, password });
      }}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 360 }}
    >
      <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField
        label="Mật khẩu" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" variant="contained" disabled={login.isPending}>
        Đăng nhập
      </Button>
    </Box>
  );
}
