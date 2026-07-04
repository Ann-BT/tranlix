import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
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
        Tạo bảng thuật ngữ mới
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tên bảng thuật ngữ"
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

function AddTermRow({
  source,
  setSource,
  target,
  setTarget,
  onAddPending,
}: {
  source: string;
  setSource: (val: string) => void;
  target: string;
  setTarget: (val: string) => void;
  onAddPending: (source: string, target: string) => void;
}) {
  const handleAdd = () => {
    if (!source.trim() || !target.trim()) return;
    onAddPending(source.trim(), target.trim());
    setSource("");
    setTarget("");
  };

  return (
    <TableRow sx={{ bgcolor: "neutral.50" }}>
      <TableCell sx={{ py: 1.5 }}>
        <TextField
          size="small"
          placeholder="Thuật ngữ gốc"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          fullWidth
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: "background.paper",
            }
          }}
        />
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <TextField
          size="small"
          placeholder="Thuật ngữ dịch"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          fullWidth
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: "background.paper",
            }
          }}
        />
      </TableCell>
      <TableCell sx={{ py: 1.5, width: 56, textAlign: "center" }}>
        <Tooltip title="Thêm vào danh sách chờ">
          <span>
            <IconButton
              size="small"
              color="primary"
              onClick={handleAdd}
              disabled={!source.trim() || !target.trim()}
              sx={{
                bgcolor: !source.trim() || !target.trim() ? "action.disabledBackground" : "rgba(0, 148, 157, 0.08)",
                "&:hover": {
                  bgcolor: "primary.main",
                  color: "white",
                },
                borderRadius: "8px",
                width: 34,
                height: 34,
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
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

  const hasTypedTerm = source.trim() !== "" && target.trim() !== "";
  const canSave = pendingTerms.length > 0 || hasTypedTerm;

  return (
    <Box sx={{ p: 2.5 }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          overflow: "hidden",
          mb: 2.5,
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow 
              sx={{ 
                "& th": { 
                  fontWeight: 700, 
                  backgroundColor: "neutral.50",
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
                <TableCell sx={{ py: 1.5 }}>
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
              <TableRow key={term.id} sx={{ backgroundColor: "rgba(0, 148, 157, 0.03)" }}>
                <TableCell sx={{ py: 1.5, fontStyle: "italic", color: "primary.main", fontWeight: 600 }}>
                  {term.source}
                </TableCell>
                <TableCell sx={{ py: 1.5, fontStyle: "italic", color: "primary.main", fontWeight: 600 }}>
                  {term.target}
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Tooltip title="Xóa khỏi danh sách chờ">
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => setPendingTerms((prev) => prev.filter((t) => t.id !== term.id))}
                      sx={{
                        bgcolor: "rgba(245, 158, 11, 0.04)",
                        "&:hover": { bgcolor: "rgba(245, 158, 11, 0.1)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            <AddTermRow
              key={addKey}
              source={source}
              setSource={setSource}
              target={target}
              setTarget={setTarget}
              onAddPending={(s, t) => {
                setPendingTerms((prev) => [
                  ...prev,
                  { source: s, target: t, id: `${Date.now()}-${prev.length}` },
                ]);
              }}
            />
          </TableBody>
        </Table>
      </TableContainer>

      {glossary.terms.length === 0 && pendingTerms.length === 0 && (
        <Box 
          sx={{ 
            textAlign: "center", 
            py: 4, 
            border: "1px dashed", 
            borderColor: "divider", 
            borderRadius: "12px",
            bgcolor: "neutral.50",
            mb: 2.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            Chưa có thuật ngữ nào. Nhập vào dòng phía trên để thêm.
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5, gap: 2, alignItems: "center" }}>
        {(pendingTerms.length > 0 || hasTypedTerm) && (
          <Typography variant="caption" sx={{ color: "warning.main", fontWeight: 600 }}>
            * Bạn có thuật ngữ mới chưa lưu. Nhấn "Lưu bảng thuật ngữ" để áp dụng.
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
            fontWeight: 600, 
            textTransform: "none", 
            py: 1, 
            px: 3,
            boxShadow: canSave ? "0 4px 12px rgba(22, 163, 74, 0.2)" : "none",
          }}
        >
          {isSaving ? "Đang lưu..." : "Lưu bảng thuật ngữ"}
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

  // The API already scopes glossaries to the current user; no client-side filtering needed.
  const glossaries = Array.isArray(rawGlossaries) ? rawGlossaries : (rawGlossaries as any)?.items || [];

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BookIcon sx={{ color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontFamily: '"Lexend", sans-serif', fontWeight: 600 }}>
            Bảng thuật ngữ
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateOpen(true)}
          sx={{ borderRadius: 2, fontFamily: '"Lexend", sans-serif' }}
        >
          Tạo bảng mới
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
            Chưa có bảng thuật ngữ nào.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Tạo bảng thuật ngữ đầu tiên
          </Button>
        </Card>
      )}

      {glossaries.map((g: any) => {
        const isOpen = selectedId === g.id;
        return (
          <Card
            key={g.id}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: isOpen ? "primary.main" : "divider",
              transition: "border-color 0.2s",
              boxShadow: isOpen ? "0 4px 20px rgba(0, 148, 157, 0.05)" : "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2.5,
                cursor: "pointer",
                "&:hover": { backgroundColor: "action.hover" },
                borderRadius: isOpen ? "12px 12px 0 0" : 3,
              }}
              onClick={() => setSelectedId(isOpen ? null : g.id)}
            >
              <BookIcon sx={{ color: isOpen ? "primary.main" : "text.secondary", flexShrink: 0 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ 
                    fontWeight: 600, 
                    fontFamily: '"Lexend", sans-serif',
                    color: isOpen ? "primary.main" : "text.primary",
                    transition: "color 0.2s",
                  }}
                >
                  {g.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {formatLanguage(g.source_lang)} → {formatLanguage(g.target_lang)}
                </Typography>
              </Box>
              <Tooltip title="Xóa bảng thuật ngữ">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Xóa bảng thuật ngữ "${g.name}"?`)) {
                      deleteGlossary.mutate(g.id, {
                        onSuccess: () => {
                          if (selectedId === g.id) setSelectedId(null);
                        },
                      });
                    }
                  }}
                  sx={{
                    bgcolor: "rgba(220, 38, 38, 0.04)",
                    "&:hover": { bgcolor: "rgba(220, 38, 38, 0.1)" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {isOpen && (
              <>
                <Divider />
                <Box sx={{ p: 0 }}>
                  <GlossaryDetail glossaryId={g.id} />
                </Box>
              </>
            )}
          </Card>
        );
      })}

      <CreateGlossaryDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Stack>
  );
}
