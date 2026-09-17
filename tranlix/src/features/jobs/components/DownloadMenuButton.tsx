import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import { jobsApi } from "../api/jobsApi";
import type { Job } from "../types";

const LEGACY_TO_MODERN: Record<string, string> = { doc: "docx", xls: "xlsx", ppt: "pptx" };
const OFFICE_EXTS = new Set(["docx", "xlsx", "pptx", "doc", "xls", "ppt"]);

function getExt(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

interface DownloadOption {
  title: string;
  icon: ReactNode;
  color: string;
  run: (id: string) => Promise<void>;
}

function getFormatIcon(ext: string) {
  const cleanExt = ext.replace(".", "").toLowerCase();
  switch (cleanExt) {
    case "pdf":
      return { icon: <PictureAsPdfOutlinedIcon fontSize="small" />, color: "#E11D48" };
    case "docx":
    case "doc":
      return { icon: <DescriptionOutlinedIcon fontSize="small" />, color: "#2563EB" };
    case "xlsx":
    case "xls":
      return { icon: <TableChartOutlinedIcon fontSize="small" />, color: "#059669" };
    case "pptx":
    case "ppt":
      return { icon: <SlideshowOutlinedIcon fontSize="small" />, color: "#EA580C" };
    default:
      return { icon: <InsertDriveFileOutlinedIcon fontSize="small" />, color: "#64748B" };
  }
}

function getDownloadOptions(job: Job): DownloadOption[] {
  const ext = getExt(job.source_filename);

  if (ext === "pdf") {
    const options: DownloadOption[] = [
      {
        title: "PDF (Gốc)",
        ...getFormatIcon("pdf"),
        run: jobsApi.download,
      },
    ];
    if (job.has_docx) {
      options.push({
        title: "DOCX",
        ...getFormatIcon("docx"),
        run: jobsApi.downloadDocx,
      });
      options.push({
        title: "DOC",
        ...getFormatIcon("doc"),
        run: jobsApi.downloadDocxLegacy,
      });
    }
    return options;
  }

  if (OFFICE_EXTS.has(ext)) {
    const modernExt = LEGACY_TO_MODERN[ext] ?? ext;
    const legacyExt = LEGACY_TO_MODERN[ext] ? ext : ({ docx: "doc", xlsx: "xls", pptx: "ppt" }[ext] ?? "doc");
    const isModernOriginal = ext === modernExt;

    return [
      {
        title: `${modernExt.toUpperCase()}${isModernOriginal ? " (Gốc)" : ""}`,
        ...getFormatIcon(modernExt),
        run: jobsApi.download,
      },
      {
        title: `${legacyExt.toUpperCase()}${!isModernOriginal ? " (Gốc)" : ""}`,
        ...getFormatIcon(legacyExt),
        run: jobsApi.downloadLegacy,
      },
    ];
  }

  return [
    {
      title: `${(ext || "file").toUpperCase()} (Gốc)`,
      ...getFormatIcon(ext),
      run: jobsApi.download,
    },
  ];
}

interface DownloadMenuButtonProps {
  job: Job;
  label?: ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outlined" | "text";
  sx?: SxProps<Theme>;
}

export function DownloadMenuButton({
  job,
  label = "Tải về",
  size = "small",
  variant = "contained",
  sx,
}: DownloadMenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const options = getDownloadOptions(job);

  const runOption = (option: DownloadOption) => {
    option.run(job.id).catch((err) => console.error("Download failed", err));
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        color="primary"
        startIcon={<DownloadIcon />}
        endIcon={<ArrowDropDownIcon />}
        onClick={handleButtonClick}
        sx={sx}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              borderRadius: "10px",
              minWidth: 160,
              p: 0.5,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 12px 30px rgba(0,0,0,0.6)"
                  : "0 6px 20px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.title}
            onClick={() => {
              setAnchorEl(null);
              runOption(option);
            }}
            sx={{
              py: 0.8,
              px: 1.5,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              transition: "all 150ms ease",
              "&:hover": {
                bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9"),
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: "auto", color: option.color }}>
              {option.icon}
            </ListItemIcon>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {option.title}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
