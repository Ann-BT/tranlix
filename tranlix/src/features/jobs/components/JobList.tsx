import {
  Box, Button, Collapse, Grid, IconButton, 
  Paper, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  TablePagination, CircularProgress, Chip
} from "@mui/material";
import { useState, useMemo } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ErrorIcon from "@mui/icons-material/Error";
import HistoryIcon from "@mui/icons-material/History";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useNavigate } from "react-router-dom";
import { TARGET_LANGUAGES } from "@features/translation";
import { formatJobDuration } from "@shared/lib/formatDuration";

import { useJobs } from "../hooks/useJobs";
import { JobStatusChip } from "./JobStatusChip";
import { DownloadMenuButton } from "./DownloadMenuButton";
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

const formatLanguage = (langCode: string) => {
  return TARGET_LANGUAGES.find((l) => l.code === langCode)?.label ?? langCode;
};

interface JobRowProps {
  job: Job;
  onCompare: (job: Job) => void;
}

function JobRow({ job, onCompare }: JobRowProps) {
  const [open, setOpen] = useState(false);

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
        <TableCell sx={{ fontWeight: 500 }}>{formatLanguage(job.target_lang)}</TableCell>
        <TableCell>
          <JobStatusChip status={job.status} />
        </TableCell>

        <TableCell align="right" sx={{ width: 280, minWidth: 280, whiteSpace: "nowrap" }}>
          {job.status === "completed" && (
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", flexWrap: "nowrap" }}>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                startIcon={<CompareArrowsIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare(job);
                }}
                sx={{
                  fontWeight: 600,
                  borderRadius: "6px",
                  textTransform: "none",
                  py: 0.5,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                So sánh
              </Button>
              <DownloadMenuButton
                job={job}
                sx={{
                  fontWeight: 600,
                  borderRadius: "6px",
                  textTransform: "none",
                  py: 0.5,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              />
            </Box>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
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
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Mã công việc (Job ID)
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", color: "text.primary", wordBreak: "break-all" }}>
                    {job.id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Thời gian thực hiện
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    <strong>Bắt đầu:</strong> {formatDate(job.created_at)}
                    <br />
                    <strong>Thời gian chạy:</strong> {job.status === "completed" || job.status === "failed" ? formatJobDuration(job) : "Đang xử lý..."}
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
  const navigate = useNavigate();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "processing" | "failed">("all");
  const [langFilter, setLangFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "filename_asc" | "filename_desc">("newest");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dynamic statistics
  const counts = useMemo(() => {
    const items = data?.items || [];
    return {
      all: items.length,
      completed: items.filter((j) => j.status === "completed").length,
      processing: items.filter((j) => j.status === "processing" || j.status === "pending").length,
      failed: items.filter((j) => j.status === "failed").length,
    };
  }, [data?.items]);

  // Unique target languages
  const targetLanguages = useMemo(() => {
    const items = data?.items || [];
    return Array.from(new Set(items.map((j) => j.target_lang))).filter(Boolean);
  }, [data?.items]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setLangFilter("all");
    setSortBy("newest");
    setPage(0);
  };

  // Filtered & Sorted jobs list
  const filteredJobs = useMemo(() => {
    if (!data?.items) return [];
    return data.items
      .filter((job) => {
        const matchSearch =
          job.source_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.target_lang.toLowerCase().includes(searchQuery.toLowerCase());

        let matchStatus = true;
        if (statusFilter === "completed") {
          matchStatus = job.status === "completed";
        } else if (statusFilter === "processing") {
          matchStatus = job.status === "processing" || job.status === "pending";
        } else if (statusFilter === "failed") {
          matchStatus = job.status === "failed";
        }

        const matchLang = langFilter === "all" || job.target_lang === langFilter;

        return matchSearch && matchStatus && matchLang;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === "filename_asc") {
          return a.source_filename.localeCompare(b.source_filename);
        }
        if (sortBy === "filename_desc") {
          return b.source_filename.localeCompare(a.source_filename);
        }
        return 0;
      });
  }, [data?.items, searchQuery, statusFilter, langFilter, sortBy]);

  const paginatedJobs = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredJobs.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredJobs, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // If there are no jobs at all on the server
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
    <Stack spacing={3.5}>
      {/* Search & Filters Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {/* Search Field */}
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm kiếm tên tệp, mã Job..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSearchQuery("");
                            setPage(0);
                          }}
                        >
                          <ClearIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    bgcolor: "background.default",
                  },
                }}
              />
            </Box>

            {/* Target Language Dropdown */}
            <Box sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="lang-select-label" sx={{ fontSize: "0.875rem" }}>Ngôn ngữ dịch</InputLabel>
                <Select
                  labelId="lang-select-label"
                  label="Ngôn ngữ dịch"
                  value={langFilter}
                  onChange={(e) => {
                    setLangFilter(e.target.value);
                    setPage(0);
                  }}
                  sx={{ borderRadius: "8px", bgcolor: "background.default", fontSize: "0.875rem" }}
                >
                  <MenuItem value="all">Tất cả ngôn ngữ</MenuItem>
                  {targetLanguages.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {formatLanguage(lang)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Sort By Dropdown */}
            <Box sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-select-label" sx={{ fontSize: "0.875rem" }}>Sắp xếp theo</InputLabel>
                <Select
                  labelId="sort-select-label"
                  label="Sắp xếp theo"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setPage(0);
                  }}
                  IconComponent={SwapVertIcon}
                  sx={{ borderRadius: "8px", bgcolor: "background.default", fontSize: "0.875rem" }}
                >
                  <MenuItem value="newest">Mới nhất trước</MenuItem>
                  <MenuItem value="oldest">Cũ nhất trước</MenuItem>
                  <MenuItem value="filename_asc">Tên tệp (A-Z)</MenuItem>
                  <MenuItem value="filename_desc">Tên tệp (Z-A)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Status Filter Chips Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              flexWrap: "wrap",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary", mr: 1 }}>
              Trạng thái:
            </Typography>
            <Chip
              label={`Tất cả (${counts.all})`}
              onClick={() => {
                setStatusFilter("all");
                setPage(0);
              }}
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                px: 0.5,
                cursor: "pointer",
              }}
            />
            <Chip
              label={`Hoàn thành (${counts.completed})`}
              onClick={() => {
                setStatusFilter("completed");
                setPage(0);
              }}
              color={statusFilter === "completed" ? "success" : "default"}
              variant={statusFilter === "completed" ? "filled" : "outlined"}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                px: 0.5,
                cursor: "pointer",
              }}
            />
            <Chip
              label={`Đang xử lý (${counts.processing})`}
              onClick={() => {
                setStatusFilter("processing");
                setPage(0);
              }}
              color={statusFilter === "processing" ? "info" : "default"}
              variant={statusFilter === "processing" ? "filled" : "outlined"}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                px: 0.5,
                cursor: "pointer",
              }}
            />
            <Chip
              label={`Lỗi (${counts.failed})`}
              onClick={() => {
                setStatusFilter("failed");
                setPage(0);
              }}
              color={statusFilter === "failed" ? "error" : "default"}
              variant={statusFilter === "failed" ? "filled" : "outlined"}
              sx={{
                fontWeight: 600,
                borderRadius: "8px",
                px: 0.5,
                cursor: "pointer",
              }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Main Table or Empty State */}
      {filteredJobs.length === 0 ? (
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
          <FilterListIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Box>
            <Typography variant="h6" sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
              Không tìm thấy kết quả phù hợp
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Thử thay đổi từ khóa tìm kiếm hoặc các điều kiện bộ lọc.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleResetFilters}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: "6px" }}
            >
              Đặt lại bộ lọc
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "12px 12px 0 0",
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: "calc(100vh - 530px)",
            }}
          >
            <Table aria-label="job history table" stickyHeader>
              <TableHead 
                sx={{ 
                  bgcolor: "neutral.50",
                  "& th": {
                    bgcolor: "neutral.50",
                  }
                }}
              >
                <TableRow>
                  <TableCell sx={{ width: 60 }} />
                  <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontFamily: '"Lexend", sans-serif' }}>Tên file</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontFamily: '"Lexend", sans-serif' }}>Ngôn ngữ dịch</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontFamily: '"Lexend", sans-serif' }}>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "text.secondary", fontFamily: '"Lexend", sans-serif', pr: 3, width: 280, minWidth: 280 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedJobs.map((job) => (
                  <JobRow key={job.id} job={job} onCompare={(selectedJob) => navigate(`/compare/${selectedJob.id}`)} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderTop: "none",
              borderColor: "divider",
              borderRadius: "0 0 12px 12px",
            }}
            count={filteredJobs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} trong ${count}`}
          />
        </>
      )}
    </Stack>
  );
}
