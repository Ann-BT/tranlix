import { Alert } from "@mui/material";
import { Component, type ReactNode } from "react";

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <Alert severity="error">Đã xảy ra lỗi: {this.state.error.message}</Alert>;
    }
    return this.props.children;
  }
}
