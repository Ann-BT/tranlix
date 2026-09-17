import {
  Box, Button, Collapse, Grid, IconButton, 
  Paper, Stack, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Typography,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel,
  Pagination, CircularProgress, Chip
} from "@mui/material";
import { useState, useMemo, useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ErrorIcon from "@mui/icons-material/Error";
import HistoryIcon from "@mui/icons-material/History";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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

function getFileTypeLabel(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "PDF",
    docx: "Word (DOCX)",
    doc: "Word (DOC)",
    pptx: "PowerPoint (PPTX)",
    ppt: "PowerPoint (PPT)",
    xlsx: "Excel (XLSX)",
    xls: "Excel (XLS)",
    png: "Hình ảnh (PNG)",
    jpg: "Hình ảnh (JPG)",
    jpeg: "Hình ảnh (JPEG)",
  };
  return map[ext] ?? ext.toUpperCase();
}

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
                variant="contained"
                startIcon={<CompareArrowsIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare(job);
                }}
                sx={{
                  fontWeight: 700,
                  borderRadius: "6px",
                  textTransform: "none",
                  py: 0.5,
                  px: 1.8,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  backgroundColor: "#2563EB",
                  color: "#FFFFFF",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                  "&:hover": {
                    backgroundColor: "#1D4ED8",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                  },
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
            <Box
              sx={{
                p: 2.5,
                my: 1.5,
                mx: 1,
                borderRadius: 2,
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle2"
                component="div"
                sx={{
                  fontFamily: '"Lexend", sans-serif',
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "primary.main",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 4,
                    height: 16,
                    bgcolor: "primary.main",
                    borderRadius: 1,
                    display: "inline-block",
                  }}
                />
                Thông tin chi tiết
              </Typography>

              <Grid container spacing={2}>
                {/* Job ID Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 1.5,
                      bgcolor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 1, display: "block" }}>
                      Mã Job (Job ID)
                    </Typography>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.04)",
                        fontFamily: '"Fira Code", monospace',
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        wordBreak: "break-all",
                        color: "text.primary",
                      }}
                    >
                      {job.id}
                    </Box>
                  </Paper>
                </Grid>

                {/* File Type Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 1.5,
                      bgcolor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 1, display: "block" }}>
                      Loại tệp & Định dạng
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 600, fontSize: "0.9rem" }}>
                      {getFileTypeLabel(job.source_filename)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                      Tên file: {job.source_filename}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Processing Timeline Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 1.5,
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 1, display: "block" }}>
                      Thời gian thực hiện
                    </Typography>
                    <Stack spacing={0.6}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" color="text.secondary">Bắt đầu:</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                          {formatDate(job.created_at)}
                        </Typography>
                      </Box>
                      {(job.status === "completed" || job.status === "failed") && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="caption" color="text.secondary">Hoàn thành:</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                            {formatDate(job.updated_at)}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 0.5, borderTop: "1px dashed", borderColor: "divider" }}>
                        <Typography variant="caption" color="text.secondary">Tổng thời gian:</Typography>
                        <Chip
                          label={
                            job.status === "completed" || job.status === "failed"
                              ? formatJobDuration(job)
                              : "Đang xử lý..."
                          }
                          size="small"
                          color={job.status === "completed" ? "success" : "default"}
                          variant="outlined"
                          sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }}
                        />
                      </Box>
                    </Stack>
                  </Paper>
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
  const [dateFilter, setDateFilter] = useState(""); // yyyy-MM-dd, derived from dateParts
  const [dateParts, setDateParts] = useState({ day: "", month: "", year: "" });
  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLInputElement>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "filename_asc" | "filename_desc">("newest");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    setDateFilter("");
    setDateParts({ day: "", month: "", year: "" });
    setSortBy("newest");
    setPage(0);
  };

  // Build dateFilter whenever dateParts change
  const applyDateFilter = (next: { day: string; month: string; year: string }) => {
    const { day, month, year } = next;
    const d = parseInt(day), m = parseInt(month), y = parseInt(year);
    if (day && month && year && year.length === 4
      && d >= 1 && d <= 31 && m >= 1 && m <= 12
      && y >= 2020 && y <= new Date().getFullYear()) {
      const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const test = new Date(iso);
      if (!isNaN(test.getTime()) && test.toISOString().startsWith(iso)) {
        setDateFilter(iso);
        return;
      }
    }
    setDateFilter("");
  };

  const handleDatePartChange = (part: "day" | "month" | "year", raw: string) => {
    const digits = raw.replace(/\D/g, "");
    let value = digits;

    if (part === "day") {
      value = digits.slice(0, 2);
      // Single digit ≥ 4 can only be 04-09, auto-pad and advance
      if (value.length === 1 && parseInt(value) >= 4) {
        value = "0" + value;
      }
      if (value.length === 2) setTimeout(() => monthRef.current?.focus(), 0);
    } else if (part === "month") {
      value = digits.slice(0, 2);
      // Single digit ≥ 2 can only be 02-09, auto-pad and advance
      if (value.length === 1 && parseInt(value) >= 2) {
        value = "0" + value;
      }
      if (value.length === 2) setTimeout(() => yearRef.current?.focus(), 0);
    } else {
      value = digits.slice(0, 4);
    }

    const next = { ...dateParts, [part]: value };
    setDateParts(next);
    applyDateFilter(next);
    setPage(0);
  };

  // Backspace: when field is empty, go back to previous field and trim its last char
  const handleDateKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, part: "day" | "month" | "year") => {
    if (e.key !== "Backspace") return;
    const current = dateParts[part];
    if (current !== "") return; // let the browser handle normal deletion
    e.preventDefault();
    if (part === "month") {
      const next = { ...dateParts, day: dateParts.day.slice(0, -1) };
      setDateParts(next);
      applyDateFilter(next);
      dayRef.current?.focus();
    } else if (part === "year") {
      const next = { ...dateParts, month: dateParts.month.slice(0, -1) };
      setDateParts(next);
      applyDateFilter(next);
      monthRef.current?.focus();
    }
    setPage(0);
  };

  // Filtered & Sorted jobs list
  const filteredJobs = useMemo(() => {
    if (!data?.items) return [];
    return data.items
      .filter((job) => {
        const matchSearch =
          job.source_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

        const matchDate = (() => {
          if (!dateFilter) return true;
          const d = new Date(job.created_at);
          const jobDate = [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, "0"),
            String(d.getDate()).padStart(2, "0"),
          ].join("-");
          return jobDate === dateFilter;
        })();

        return matchSearch && matchStatus && matchLang && matchDate;
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
  }, [data?.items, searchQuery, statusFilter, langFilter, sortBy, dateFilter]);

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
                placeholder="Tìm kiếm tên tệp..."
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

            {/* Date Filter — Ngày / Tháng / Năm */}
            <Box sx={{ width: { xs: "100%", sm: "50%", md: "25%" } }}>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: dateFilter ? "primary.main" : "divider",
                  borderRadius: "8px",
                  bgcolor: "background.default",
                  display: "flex",
                  alignItems: "center",
                  px: 1.5,
                  py: "5px",
                  gap: 0.5,
                  height: "40px",
                  "&:hover": { borderColor: "text.primary" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", flex: 1, gap: 0.5 }}>
                  <input
                    ref={dayRef}
                    placeholder="Ngày"
                    value={dateParts.day}
                    maxLength={2}
                    onChange={(e) => handleDatePartChange("day", e.target.value)}
                    onKeyDown={(e) => handleDateKeyDown(e, "day")}
                    style={{
                      width: 38, border: "none", outline: "none", background: "transparent",
                      fontSize: "0.875rem", textAlign: "center", color: "inherit",
                    }}
                  />
                  <span style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>/</span>
                  <input
                    ref={monthRef}
                    placeholder="Tháng"
                    value={dateParts.month}
                    maxLength={2}
                    onChange={(e) => handleDatePartChange("month", e.target.value)}
                    onKeyDown={(e) => handleDateKeyDown(e, "month")}
                    style={{
                      width: 44, border: "none", outline: "none", background: "transparent",
                      fontSize: "0.875rem", textAlign: "center", color: "inherit",
                    }}
                  />
                  <span style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>/</span>
                  <input
                    ref={yearRef}
                    placeholder="Năm"
                    value={dateParts.year}
                    maxLength={4}
                    onChange={(e) => handleDatePartChange("year", e.target.value)}
                    onKeyDown={(e) => handleDateKeyDown(e, "year")}
                    style={{
                      width: 44, border: "none", outline: "none", background: "transparent",
                      fontSize: "0.875rem", textAlign: "center", color: "inherit",
                    }}
                  />
                </Box>
                {/* Calendar icon triggers hidden native date picker */}
                {!dateFilter && (
                  <IconButton size="small" sx={{ p: 0.3 }} onClick={() => calendarRef.current?.showPicker?.() ?? calendarRef.current?.click()}>
                    <CalendarTodayIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                  </IconButton>
                )}
                {dateFilter && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      setDateFilter("");
                      setDateParts({ day: "", month: "", year: "" });
                      setPage(0);
                    }}
                    sx={{ p: 0.3 }}
                  >
                    <ClearIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                )}
                {/* Hidden native date input for calendar picker */}
                <input
                  ref={calendarRef}
                  type="date"
                  min="2020-01-01"
                  max={new Date().toISOString().split("T")[0]}
                  value={dateFilter}
                  onChange={(e) => {
                    const val = e.target.value; // yyyy-MM-dd
                    if (val) {
                      const [y, m, d] = val.split("-");
                      setDateParts({ day: d, month: m, year: y });
                      setDateFilter(val);
                      setPage(0);
                    }
                  }}
                  style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
                />
              </Box>
              {dateParts.day && dateParts.month && dateParts.year && dateParts.year.length === 4 && !dateFilter && (
                <Typography variant="caption" color="error" sx={{ ml: 0.5, mt: 0.3, display: "block" }}>
                  Ngày không hợp lệ
                </Typography>
              )}
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
                  <MenuItem value="newest">Mới nhất</MenuItem>
                  <MenuItem value="oldest">Cũ nhất</MenuItem>
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
            }}
          >
            <Table aria-label="job history table" stickyHeader>
              <TableHead 
                sx={{ 
                  "& th": {
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "#0F172A" : "#F1F5F9"),
                    color: "text.secondary",
                    fontWeight: 700,
                    fontFamily: '"Lexend", sans-serif',
                    borderBottom: "2px solid",
                    borderColor: "divider",
                    zIndex: 10,
                  }
                }}
              >
                <TableRow>
                  <TableCell sx={{ width: 60 }} />
                  <TableCell>Tên file</TableCell>
                  <TableCell>Ngôn ngữ dịch</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right" sx={{ pr: 3, width: 280, minWidth: 280 }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedJobs.map((job) => (
                  <JobRow key={job.id} job={job} onCompare={(selectedJob) => navigate(`/compare/${selectedJob.id}`)} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Custom Modern Pagination Bar */}
          {(() => {
            const total = filteredJobs.length;
            const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
            const from = total === 0 ? 0 : page * rowsPerPage + 1;
            const to = Math.min((page + 1) * rowsPerPage, total);

            return (
              <Paper
                elevation={0}
                sx={{
                  position: "sticky",
                  bottom: 0,
                  zIndex: 100,
                  p: 1.5,
                  px: 2.5,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  border: "1px solid",
                  borderTop: "none",
                  borderColor: "divider",
                  borderRadius: "0 0 12px 12px",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark" ? "#0F172A" : "#FFFFFF",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 -4px 20px rgba(0, 0, 0, 0.5)"
                      : "0 -4px 16px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontFamily: '"Lexend", sans-serif',
                    fontSize: "0.85rem",
                  }}
                >
                  Hiển thị{" "}
                  <Typography component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {from}–{to}
                  </Typography>{" "}
                  trong tổng số{" "}
                  <Typography component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {total}
                  </Typography>{" "}
                  bản ghi
                </Typography>

                <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontFamily: '"Lexend", sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      Số dòng:
                    </Typography>
                    <Select
                      size="small"
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setPage(0);
                      }}
                      sx={{
                        height: 32,
                        borderRadius: "6px",
                        fontSize: "0.82rem",
                        fontFamily: '"Lexend", sans-serif',
                        fontWeight: 600,
                      }}
                    >
                      {[5, 10, 25, 50].map((num) => (
                        <MenuItem key={num} value={num} sx={{ fontSize: "0.82rem", fontFamily: '"Lexend", sans-serif' }}>
                          {num}
                        </MenuItem>
                      ))}
                    </Select>
                  </Stack>

                  <Pagination
                    count={totalPages}
                    page={page + 1}
                    onChange={(_e, newPage) => setPage(newPage - 1)}
                    color="primary"
                    shape="rounded"
                    size="small"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        fontFamily: '"Lexend", sans-serif',
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        borderRadius: "6px",
                      },
                      "& .Mui-selected": {
                        backgroundColor: "#10B981 !important",
                        color: "#FFFFFF",
                      },
                    }}
                  />
                </Stack>
              </Paper>
            );
          })()}
        </>
      )}
    </Stack>
  );
}
