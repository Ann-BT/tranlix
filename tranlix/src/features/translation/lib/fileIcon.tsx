import { Article, TableChart, Slideshow, InsertDriveFile } from "@mui/icons-material";

export function getFileIconAndColor(filename: string) {
  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  if (ext === ".docx" || ext === ".doc") {
    return { icon: <Article sx={{ fontSize: 24 }} />, color: "#1B6EF3" }; // Word Blue
  }
  if (ext === ".xlsx" || ext === ".xls") {
    return { icon: <TableChart sx={{ fontSize: 24 }} />, color: "#107C41" }; // Excel Green
  }
  if (ext === ".pptx" || ext === ".ppt") {
    return { icon: <Slideshow sx={{ fontSize: 24 }} />, color: "#C43E1C" }; // PowerPoint Orange
  }
  if (ext === ".pdf") {
    return { icon: <Article sx={{ fontSize: 24 }} />, color: "#E01B22" }; // PDF Red
  }
  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
    return { icon: <InsertDriveFile sx={{ fontSize: 24 }} />, color: "#8B5CF6" }; // Image Purple
  }
  return { icon: <InsertDriveFile sx={{ fontSize: 24 }} />, color: "#64748B" }; // Default Grey
}
