import {
  Box, Button, CircularProgress, Collapse, Grid, IconButton, 
  LinearProgress, Paper, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownloadIcon from "@mui/icons-material/Download";
import ErrorIcon from "@mui/icons-material/Error";
import HistoryIcon from "@mui/icons-material/History";

import { jobsApi } from "../api/jobsApi";
import { useJobs } from "../hooks/useJobs";
import { JobStatusChip } from "./JobStatusChip";
import type { Job } from "../types";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}

function JobRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);

  const getProgressColor = () => {
    if (job.status === "failed") return "error";
    if (job.status === "completed") return "success";
    return "info";
  };

  return (
    <>
      <TableRow 
        hover
        onClick={() => setOpen(!open)}
        sx={{ 
          cursor: "pointer", 
          "& > *": { borderBottom: "unset" },
          bgcolor: open ? "rgba(0, 148, 157, 0.02)" : "inherit",
          transition: "background-color 150ms",
        }}
      >
        <TableCell sx={{ width: 48 }}>
          <IconButton size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ fontWeight: 600, fontFamily: '"Lexend", sans-serif', color: "text.primary" }}>
          {job.source_filename}
        </TableCell>
        <TableCell sx={{ fontWeight: 500 }}>{job.target_lang}</TableCell>
        <TableCell>
          <JobStatusChip status={job.status} />
        </TableCell>
        <TableCell sx={{ width: 180 }}>
          <Stack spacing={0.5} component="div">
            <LinearProgress 
              variant="determinate" 
              value={job.progress} 
              color={getProgressColor()}
              sx={{ height: 6, borderRadius: 3, bgcolor: "rgba(0,0,0,0.05)" }}
            />
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
              {job.progress}%
            </Typography>
          </Stack>
        </TableCell>
        <TableCell align="right" sx={{ width: 120 }}>
          {job.status === "completed" && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<DownloadIcon />}
              href={jobsApi.downloadUrl(job.id)}
              onClick={(e) => e.stopPropagation()}
              sx={{
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "none",
                py: 0.5,
              }}
            >
              Tải về
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, py: 1 }}>
              <Typography 
                variant="subtitle2" 
                gutterBottom 
                component="div" 
                sx={{ 
                  fontFamily: '"Lexend", sans-serif', 
                  fontWeight: 600, 
                  color: "secondary.main", 
                  mb: 2 
                }}
              >
                Thông tin chi tiết
              </Typography>
              <Grid container spacing={3} sx={{ mb: 1 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Mã công việc (Job ID)
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.primary", wordBreak: "break-all" }}>
                    {job.id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Chế độ dịch
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {job.inline_mode ? "Inline Mode (Giữ định dạng chữ)" : "Merge Mode (Mặc định)"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Số lượng đoạn (Segments)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {job.segment_count !== null ? `${job.segment_count} đoạn` : "Đang phân tích..."}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Thời gian thực hiện
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "text.primary" }}>
                    Tạo: {formatDate(job.created_at)}
                    <br />
                    Cập nhật: {formatDate(job.updated_at)}
                  </Typography>
                </Grid>
              </Grid>

              {job.error && (
                <Box 
                  sx={{ 
                    mt: 2.5, 
                    p: 2, 
                    borderRadius: "8px", 
                    bgcolor: "rgba(220, 38, 38, 0.02)",
                    border: "1px solid", 
                    borderColor: "error.light",
                  }}
                >
                  <Stack direction="row" spacing={1} sx={{ mb: 1, color: "error.main", alignItems: "center" }} component="div">
                    <ErrorIcon fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Nhật ký lỗi hệ thống (Pipeline Error Log)
                    </Typography>
                  </Stack>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: "Consolas, Monaco, monospace", 
                      color: "error.main",
                      whiteSpace: "pre-wrap",
                      fontSize: "0.825rem",
                      bgcolor: "#FFF5F5",
                      p: 1.5,
                      borderRadius: "6px",
                      border: "1px dashed",
                      borderColor: "error.light"
                    }}
                  >
                    {job.error}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function JobList() {
  const { data, isLoading } = useJobs();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!data?.items.length) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          p: 6, 
          textAlign: "center", 
          bgcolor: "background.paper", 
          border: "1px solid", 
          borderColor: "divider",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <HistoryIcon sx={{ fontSize: 48, color: "text.disabled" }} />
        <Box>
          <Typography variant="h6" sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
            Lịch sử trống
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bạn chưa thực hiện dịch tài liệu nào trên hệ thống.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0} 
      sx={{ 
        border: "1px solid", 
        borderColor: "divider", 
        borderRadius: "12px",
        overflowX: "auto" 
      }}
    >
      <Table aria-label="job history table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ fontWeight: 600 }}>Tên file</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Ngôn ngữ dịch</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Tiến độ</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.items.map((job) => (
            <JobRow key={job.id} job={job} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
