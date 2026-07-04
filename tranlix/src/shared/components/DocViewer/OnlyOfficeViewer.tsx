import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { ViewInfo } from "@features/jobs/types";

declare global {
  interface Window {
    DocsAPI?: {
      DocEditor: new (containerId: string, config: unknown) => { destroyEditor?: () => void };
    };
  }
}

let _scriptPromise: Promise<void> | null = null;

function loadOnlyOfficeScript(serverUrl: string): Promise<void> {
  if (window.DocsAPI) return Promise.resolve();
  if (!_scriptPromise) {
    _scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[src*="web-apps/apps/api/documents/api.js"]`
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", reject);
        return;
      }
      const s = document.createElement("script");
      s.src = `${serverUrl}/web-apps/apps/api/documents/api.js`;
      s.onload = () => resolve();
      s.onerror = () => {
        _scriptPromise = null;
        reject(new Error("OnlyOffice script load failed"));
      };
      document.head.appendChild(s);
    });
  }
  return _scriptPromise;
}

interface Props {
  viewInfo: ViewInfo;
  editorId: string;
}

const ONLYOFFICE_URL = (import.meta.env.VITE_ONLYOFFICE_URL as string | undefined) ?? "";

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"]);

export function OnlyOfficeViewer({ viewInfo, editorId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<{ destroyEditor?: () => void } | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const isImage = IMAGE_EXT.has(viewInfo.filetype.toLowerCase());

  useEffect(() => {
    if (isImage) {
      setStatus("ready");
      return;
    }

    if (!ONLYOFFICE_URL) {
      setStatus("error");
      setErrorMsg("VITE_ONLYOFFICE_URL chưa được cấu hình. Vui lòng tải file xuống để xem.");
      return;
    }

    let destroyed = false;
    setStatus("loading");
    setErrorMsg("");

    loadOnlyOfficeScript(ONLYOFFICE_URL)
      .then(() => {
        if (destroyed || !window.DocsAPI || !containerRef.current) return;

        if (editorInstanceRef.current?.destroyEditor) {
          editorInstanceRef.current.destroyEditor();
          editorInstanceRef.current = null;
        }

        containerRef.current.innerHTML = "";
        const mount = document.createElement("div");
        mount.id = editorId;
        containerRef.current.appendChild(mount);

        editorInstanceRef.current = new window.DocsAPI!.DocEditor(editorId, {
          document: {
            fileType: viewInfo.filetype,
            key: viewInfo.doc_key,
            title: viewInfo.filename,
            url: viewInfo.url,
            permissions: {
              edit: false,
              download: false,
              print: false,
              comment: false,
              fillForms: false,
            },
          },
          documentType: viewInfo.document_type,
          type: "embedded",
          editorConfig: {
            mode: "view",
            lang: "vi",
            customization: {
              autosave: false,
              chat: false,
              compactHeader: true,
              feedback: { visible: false },
              forcesave: false,
              help: false,
              plugins: false,
              toolbarNoTabs: true,
              hideRightMenu: true,
              uiTheme: "theme-light",
            },
          },
          events: {
            onAppReady: () => setStatus("ready"),
            onError: (e: unknown) => {
              // OnlyOffice onError passes { data: { errorCode, errorDescription } }
              const desc =
                (e as any)?.data?.errorDescription ??
                (e as any)?.message ??
                JSON.stringify(e);
              console.error("[OnlyOffice] onError:", e);
              setStatus("error");
              setErrorMsg(desc);
            },
            onRequestClose: () => setStatus("error"),
          },
        });
      })
      .catch((e: unknown) => {
        if (!destroyed) {
          const msg = e instanceof Error ? e.message : String(e);
          setStatus("error");
          setErrorMsg(`Không thể kết nối OnlyOffice server: ${msg}`);
        }
      });

    return () => {
      destroyed = true;
      if (editorInstanceRef.current?.destroyEditor) {
        editorInstanceRef.current.destroyEditor();
        editorInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewInfo.url, viewInfo.doc_key]);

  if (isImage) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          bgcolor: "#f5f5f5",
        }}
      >
        <img
          src={viewInfo.url}
          alt={viewInfo.filename}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      {status === "loading" && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <CircularProgress size={32} />
        </Box>
      )}

      {status === "error" && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            p: 3,
            bgcolor: "background.paper",
            zIndex: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center" component="p">
            {errorMsg || "Không thể hiển thị tài liệu."}
          </Typography>
        </Box>
      )}

      <Box ref={containerRef} sx={{ width: "100%", height: "100%" }} />
    </Box>
  );
}
