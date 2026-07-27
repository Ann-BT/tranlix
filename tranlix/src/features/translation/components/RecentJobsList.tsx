import { Box, Button, Card, Chip, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { TARGET_LANGUAGES } from "../types";
import type { RecentJob } from "../types";
import { getFileIconAndColor } from "../lib/fileIcon";
import { formatJobDuration } from "@shared/lib/formatDuration";

const formatLanguage = (langCode: string) =>
  TARGET_LANGUAGES.find((l) => l.code === langCode)?.label ?? langCode;

interface Props {
  jobs: RecentJob[];
}

export function RecentJobsList({ jobs }: Props) {
  const navigate = useNavigate();

  if (jobs.length === 0) return null;

  return (
    <Box sx={{ p: 3, bgcolor: "background.paper" }}>
      <Stack spacing={2}>
        {jobs.map((rj) => {
          const { icon, color } = getFileIconAndColor(rj.source_filename);
          return (
            <Card
              key={rj.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: "1px solid",
                borderColor: rj.status === "completed" ? "success.light" : rj.status === "failed" ? "error.light" : "divider",
                bgcolor: rj.status === "completed" ? "rgba(46, 125, 50, 0.01)" : rj.status === "failed" ? "rgba(211, 47, 47, 0.01)" : "background.default",
                boxShadow: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "none",
                  boxShadow: "none",
                }
              }}
            >
              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, sm: 5 }} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ color, display: "flex", alignItems: "center" }}>
                    {icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: '"Source Sans 3", sans-serif',
                      }}
                    >
                      {rj.source_filename}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dịch sang: {formatLanguage(rj.target_lang)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }} sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                  {rj.status === "pending" && (
                    <Chip label="Đã tải lên" size="small" color="info" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                  )}
                  {rj.status === "processing" && (
                    <Chip label="Đang xử lý" size="small" color="warning" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                  )}
                  {rj.status === "completed" && (
                    <Chip label="Hoàn thành" size="small" color="success" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                  )}
                  {rj.status === "failed" && (
                    <Chip label="Thất bại" size="small" color="error" variant="outlined" sx={{ borderRadius: "4px", fontWeight: 600 }} />
                  )}

                  {(rj.status === "completed" || rj.status === "failed") && (
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      ({formatJobDuration(rj)})
                    </Typography>
                  )}
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }} sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  {rj.status === "completed" && (
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => navigate(`/compare/${rj.id}`)}
                      sx={{
                        fontWeight: 600,
                        borderRadius: "6px",
                        textTransform: "none",
                        py: 0.5,
                        fontSize: "0.8rem",
                      }}
                    >
                      So sánh
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
