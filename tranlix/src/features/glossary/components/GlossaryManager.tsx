import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import BookIcon from "@mui/icons-material/MenuBook";
import SaveIcon from "@mui/icons-material/Save";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { glossaryKeys } from "../hooks/useGlossaries";
import { apiClient } from "@shared/api/client";

import { useGlossaries, useGlossary } from "../hooks/useGlossaries";
import { useCreateGlossary } from "../hooks/useCreateGlossary";
import { useDeleteGlossary } from "../hooks/useDeleteGlossary";
import { useDeleteTerm } from "../hooks/useGlossaryTerms";
import { TARGET_LANGUAGES } from "@features/translation/types";

const formatLanguage = (langCode: string) => {
  if (langCode === "auto") return "Tự động";
  return TARGET_LANGUAGES.find((l) => l.code === langCode)?.label ?? langCode;
};

function CreateGlossaryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateGlossary();
  const [name, setName] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("English");

  const handleSubmit = () => {
    create.mutate(
      { name, source_lang: sourceLang, target_lang: targetLang },
      {
        onSuccess: () => {
          setName("");
          setSourceLang("auto");
          setTargetLang("English");
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
        Tạo bộ thuật ngữ chuyên ngành mới
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tên bộ thuật ngữ chuyên ngành"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            autoFocus
          />
          <FormControl fullWidth size="small">
            <InputLabel>Ngôn ngữ nguồn</InputLabel>
            <Select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              label="Ngôn ngữ nguồn"
            >
              <MenuItem value="auto">Tự động</MenuItem>
              {TARGET_LANGUAGES.map((l) => (
                <MenuItem key={l.code} value={l.code}>
                  {l.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Ngôn ngữ đích</InputLabel>
            <Select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              label="Ngôn ngữ đích"
            >
              {TARGET_LANGUAGES.map((l) => (
                <MenuItem key={l.code} value={l.code}>
                  {l.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {create.isError && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {create.error?.message}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!name.trim() || create.isPending}
          sx={{ borderRadius: 2 }}
        >
          {create.isPending ? <CircularProgress size={20} /> : "Tạo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function GlossaryDetail({ glossaryId }: { glossaryId: string }) {
  const { data: glossary, isLoading } = useGlossary(glossaryId);
  const deleteTerm = useDeleteTerm(glossaryId);
  const queryClient = useQueryClient();
  const [addKey, setAddKey] = useState(0);
  const [pendingTerms, setPendingTerms] = useState<{ source: string; target: string; id: string }[]>([]);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  if (!glossary) return null;

  const handleAddTerm = () => {
    if (!source.trim() || !target.trim()) return;
    setPendingTerms((prev) => [
      ...prev,
      { source: source.trim(), target: target.trim(), id: `${Date.now()}-${prev.length}` },
    ]);
    setSource("");
    setTarget("");
    setAddKey((k) => k + 1);
  };

  const hasTypedTerm = source.trim() !== "" && target.trim() !== "";
  const canSave = pendingTerms.length > 0 || hasTypedTerm;

  return (
    <Box sx={{ p: 2 }}>
      {/* Terms Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          overflow: "hidden",
          mb: 1.5,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow 
              sx={{ 
                "& th": { 
                  fontWeight: 700, 
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#0F172A" : "#F8FAFC",
                  fontFamily: '"Lexend", sans-serif',
                  color: "text.secondary",
                  py: 1.5,
                } 
              }}
            >
              <TableCell>Thuật ngữ gốc</TableCell>
              <TableCell>Thuật ngữ dịch</TableCell>
              <TableCell sx={{ width: 56 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Saved Terms */}
            {glossary.terms.map((term) => (
              <TableRow key={term.id} hover>
                <TableCell sx={{ py: 1.5, fontWeight: 500 }}>{term.source}</TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 500 }}>{term.target}</TableCell>
                <TableCell sx={{ py: 1.5, textAlign: "center" }}>
                  <Tooltip title="Xóa thuật ngữ">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteTerm.mutate(term.id)}
                      disabled={deleteTerm.isPending}
                      sx={{
                        bgcolor: "rgba(220, 38, 38, 0.04)",
                        "&:hover": { bgcolor: "rgba(220, 38, 38, 0.1)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {/* Staged/Pending Terms */}
            {pendingTerms.map((term) => (
              <TableRow key={term.id} sx={{ backgroundColor: "rgba(16, 185, 129, 0.06)" }}>
                <TableCell sx={{ py: 1.5, fontStyle: "italic", color: "#10B981", fontWeight: 700 }}>
                  {term.source}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontStyle: "italic", color: "#10B981", fontWeight: 700 }}>
                  {term.target}
                </TableCell>
                <TableCell sx={{ py: 1.5, textAlign: "center" }}>
                  <Tooltip title="Xóa khỏi danh sách chờ">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setPendingTerms((prev) => prev.filter((t) => t.id !== term.id))}
                      sx={{
                        bgcolor: "rgba(245, 158, 11, 0.08)",
                        "&:hover": { bgcolor: "rgba(245, 158, 11, 0.18)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {glossary.terms.length === 0 && pendingTerms.length === 0 && (
        <Box 
          sx={{ 
            textAlign: "center", 
            py: 3, 
            border: "1px dashed", 
            borderColor: "divider", 
            borderRadius: "12px",
            bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "#F8FAFC"),
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            Chưa có thuật ngữ nào. Sử dụng khung thêm thuật ngữ bên dưới để tạo.
          </Typography>
        </Box>
      )}

      {/* Prominent Add Term Section - Right Below Available Terms */}
      <Paper
        key={addKey}
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "12px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.04)",
          border: "1.5px dashed",
          borderColor: "#10B981",
          mb: 2.5,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 800,
            fontFamily: '"Lexend", sans-serif',
            color: "#10B981",
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "0.88rem",
          }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Thêm thuật ngữ mới
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Thuật ngữ gốc (ví dụ: radiography)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            fullWidth
            onKeyDown={(e) => e.key === "Enter" && handleAddTerm()}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "background.paper",
                fontFamily: '"Lexend", sans-serif',
              },
            }}
          />
          <TextField
            size="small"
            placeholder="Thuật ngữ dịch (ví dụ: chụp X-quang)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            fullWidth
            onKeyDown={(e) => e.key === "Enter" && handleAddTerm()}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                bgcolor: "background.paper",
                fontFamily: '"Lexend", sans-serif',
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTerm}
            disabled={!source.trim() || !target.trim()}
            sx={{
              borderRadius: "8px",
              fontWeight: 700,
              fontFamily: '"Lexend", sans-serif',
              textTransform: "none",
              backgroundColor: "#10B981",
              color: "#FFFFFF",
              px: 3,
              minWidth: 100,
              height: 40,
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              "&:hover": {
                backgroundColor: "#059669",
              },
            }}
          >
            Thêm
          </Button>
        </Stack>
      </Paper>

      {/* Save Action Footer */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, alignItems: "center" }}>
        {(pendingTerms.length > 0 || hasTypedTerm) && (
          <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 700 }}>
            * Bạn có thuật ngữ mới chưa lưu. Nhấn "Lưu thuật ngữ" để áp dụng.
          </Typography>
        )}
        <Button
          variant="contained"
          color={canSave ? "success" : "primary"}
          startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          disabled={isSaving || !canSave}
          onClick={async () => {
            setIsSaving(true);
            try {
              const termsToSave = [...pendingTerms];
              if (source.trim() && target.trim()) {
                termsToSave.push({
                  source: source.trim(),
                  target: target.trim(),
                  id: "typed-term",
                });
              }

              await Promise.all(
                termsToSave.map((t) =>
                  apiClient.post(`/glossaries/${glossaryId}/terms`, {
                    source: t.source,
                    target: t.target,
                  })
                )
              );
              setPendingTerms([]);
              setSource("");
              setTarget("");
              setAddKey((k) => k + 1);
              queryClient.invalidateQueries({ queryKey: glossaryKeys.detail(glossaryId) });
            } catch (e) {
              console.error(e);
            } finally {
              setIsSaving(false);
            }
          }}
          sx={{ 
            borderRadius: "8px", 
            fontWeight: 700, 
            fontFamily: '"Lexend", sans-serif',
            textTransform: "none", 
            py: 1, 
            px: 3,
            backgroundColor: canSave ? "#10B981" : undefined,
            boxShadow: canSave ? "0 4px 14px rgba(16, 185, 129, 0.3)" : "none",
            "&:hover": {
              backgroundColor: canSave ? "#059669" : undefined,
            },
          }}
        >
          {isSaving ? "Đang lưu..." : "Lưu thuật ngữ"}
        </Button>
      </Box>
    </Box>
  );
}

export function GlossaryManager() {
  const { data: rawGlossaries, isLoading } = useGlossaries();
  const deleteGlossary = useDeleteGlossary();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // The API already scopes glossaries to the current user; no client-side filtering needed.
  const glossaries = Array.isArray(rawGlossaries) ? rawGlossaries : (rawGlossaries as any)?.items || [];

  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BookIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
            Thuật ngữ chuyên ngành
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ borderRadius: 2, fontFamily: '"Lexend", sans-serif' }}
        >
          Tạo bộ thuật ngữ mới
        </Button>
      </Box>

      {isLoading && <CircularProgress size={24} sx={{ alignSelf: "center" }} />}

      {!isLoading && glossaries.length === 0 && (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
            textAlign: "center",
            py: 6,
          }}
        >
          <BookIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Chưa có thuật ngữ chuyên ngành nào.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Tạo bộ thuật ngữ chuyên ngành đầu tiên
          </Button>
        </Card>
      )}

      {glossaries.map((g: any) => {
        const isOpen = selectedId === g.id;
        return (
          <ClickAwayListener
            key={g.id}
            onClickAway={() => { if (isOpen) setSelectedId(null); }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: isOpen ? "#10B981" : "divider",
                transition: "border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: isOpen
                  ? (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 10px 30px rgba(0, 0, 0, 0.5)"
                        : "0 8px 24px rgba(16, 185, 129, 0.12)"
                  : "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 1.5,
                  px: 2.5,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                  borderRadius: isOpen ? "12px 12px 0 0" : 3,
                  transition: "border-radius 0.3s",
                }}
                onClick={() => setSelectedId(isOpen ? null : g.id)}
              >
                <BookIcon sx={{ color: isOpen ? "#10B981" : "text.secondary", flexShrink: 0, transition: "color 0.3s" }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontFamily: '"Lexend", sans-serif',
                      color: isOpen ? "#10B981" : "text.primary",
                      transition: "color 0.3s",
                    }}
                  >
                    {g.name}
                  </Typography>
                  <Stack direction="row" spacing={0.6} sx={{ alignItems: "center", mt: 0.3, display: "inline-flex" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {formatLanguage(g.source_lang)}
                    </Typography>
                    <ArrowForwardIcon sx={{ fontSize: 13, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      {formatLanguage(g.target_lang)}
                    </Typography>
                  </Stack>
                </Box>
                <Tooltip title="Xóa bộ thuật ngữ">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id: g.id, name: g.name });
                    }}
                    sx={{
                      bgcolor: "rgba(220, 38, 38, 0.04)",
                      "&:hover": { bgcolor: "rgba(220, 38, 38, 0.1)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <KeyboardArrowDownIcon
                  sx={{
                    color: isOpen ? "#10B981" : "text.secondary",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s",
                  }}
                />
              </Box>

              <Collapse in={isOpen} timeout={{ enter: 320, exit: 220 }} unmountOnExit={false}>
                <Divider />
                <Box sx={{ p: 0 }}>
                  <GlossaryDetail glossaryId={g.id} />
                </Box>
              </Collapse>
            </Card>
          </ClickAwayListener>
        );
      })}

      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1,
              maxWidth: 420,
              width: "100%",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontFamily: '"Lexend", sans-serif', pb: 1 }}>
          Xác nhận xóa bộ thuật ngữ
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Bạn có chắc chắn muốn xóa bộ thuật ngữ <strong>"{deleteTarget?.name}"</strong>? Tất cả thuật ngữ bên trong sẽ bị xóa và không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            variant="outlined"
            color="inherit"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={() => {
              if (deleteTarget) {
                deleteGlossary.mutate(deleteTarget.id, {
                  onSuccess: () => {
                    if (selectedId === deleteTarget.id) setSelectedId(null);
                    setDeleteTarget(null);
                  },
                });
              }
            }}
            variant="contained"
            color="error"
            autoFocus
            disabled={deleteGlossary.isPending}
            sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#DC2626", "&:hover": { bgcolor: "#B91C1C" } }}
          >
            {deleteGlossary.isPending ? "Đang xóa..." : "Xóa bộ thuật ngữ"}
          </Button>
        </DialogActions>
      </Dialog>

      <CreateGlossaryDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Stack>
  );
}
