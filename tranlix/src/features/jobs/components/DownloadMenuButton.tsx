import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { jobsApi } from "../api/jobsApi";
import type { Job } from "../types";

const LEGACY_TO_MODERN: Record<string, string> = { doc: "docx", xls: "xlsx", ppt: "pptx" };
const OFFICE_EXTS = new Set(["docx", "xlsx", "pptx", "doc", "xls", "ppt"]);

function getExt(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}

interface DownloadOption {
  label: string;
  run: (id: string) => Promise<void>;
}

/** What format choices make sense for this job. PDF Text Layer jobs can
 * export the PDF itself, plus the DOCX companion (and a .doc conversion of
 * it) when one was produced. Office Pipeline jobs can always export both the
 * new OOXML format and a legacy .doc/.xls/.ppt conversion — offered
 * regardless of whether the upload itself was modern or legacy, since old MS
 * Office can't open the new format at all either way. */
function getDownloadOptions(job: Job): DownloadOption[] {
  const ext = getExt(job.source_filename);

  if (ext === "pdf") {
    const options: DownloadOption[] = [{ label: "PDF (bản dịch)", run: jobsApi.download }];
    if (job.has_docx) {
      options.push({ label: "DOCX (chỉnh sửa được)", run: jobsApi.downloadDocx });
      options.push({ label: "DOC (định dạng cũ)", run: jobsApi.downloadDocxLegacy });
    }
    return options;
  }

  if (OFFICE_EXTS.has(ext)) {
    const modernExt = LEGACY_TO_MODERN[ext] ?? ext;
    const legacyExt = LEGACY_TO_MODERN[ext] ? ext : { docx: "doc", xlsx: "xls", pptx: "ppt" }[ext];
    return [
      { label: `Định dạng mới (.${modernExt})`, run: jobsApi.download },
      { label: `Định dạng cũ (.${legacyExt})`, run: jobsApi.downloadLegacy },
    ];
  }

  return [{ label: "Tải về", run: jobsApi.download }];
}

interface DownloadMenuButtonProps {
  job: Job;
  label?: ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "outlined" | "text";
  sx?: SxProps<Theme>;
}

export function DownloadMenuButton({
  job, label = "Tải về", size = "small", variant = "contained", sx,
}: DownloadMenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const options = getDownloadOptions(job);

  const runOption = (option: DownloadOption) => {
    option.run(job.id).catch((err) => console.error("Download failed", err));
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (options.length === 1) {
      runOption(options[0]);
      return;
    }
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        color="primary"
        startIcon={<DownloadIcon />}
        endIcon={options.length > 1 ? <ArrowDropDownIcon /> : undefined}
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
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              setAnchorEl(null);
              runOption(option);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
