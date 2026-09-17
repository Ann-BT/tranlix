import { apiClient } from "@shared/api/client";
import type { Glossary, GlossaryListItem, CreateGlossaryInput, AddTermInput, GlossaryTerm } from "../types";

export const MOCK_GLOSSARIES: Glossary[] = [
  {
    id: "glos-001",
    owner_id: "user-001",
    name: "Thuật ngữ Kỹ thuật Y tế Varex",
    source_lang: "English",
    target_lang: "Tiếng Việt",
    created_at: "2026-09-01T09:00:00Z",
    updated_at: "2026-09-10T14:30:00Z",
    terms: [
      { id: "t-1", glossary_id: "glos-001", source: "radiography", target: "chụp X-quang", created_at: "2026-09-01T09:00:00Z", updated_at: "2026-09-01T09:00:00Z" },
      { id: "t-2", glossary_id: "glos-001", source: "flat panel detector", target: "bộ thu nhận hình ảnh tấm phẳng", created_at: "2026-09-01T09:05:00Z", updated_at: "2026-09-01T09:05:00Z" },
      { id: "t-3", glossary_id: "glos-001", source: "tube housing assembly", target: "cụm vỏ bóng X-quang", created_at: "2026-09-02T10:15:00Z", updated_at: "2026-09-02T10:15:00Z" },
      { id: "t-4", glossary_id: "glos-001", source: "beam limiting device", target: "thiết bị giới hạn chùm tia (collimator)", created_at: "2026-09-03T11:20:00Z", updated_at: "2026-09-03T11:20:00Z" },
      { id: "t-5", glossary_id: "glos-001", source: "anode rotation speed", target: "tốc độ quay anốt", created_at: "2026-09-04T13:40:00Z", updated_at: "2026-09-04T13:40:00Z" },
      { id: "t-6", glossary_id: "glos-001", source: "exposure time", target: "thời gian phát tia", created_at: "2026-09-05T15:10:00Z", updated_at: "2026-09-05T15:10:00Z" },
    ],
  },
  {
    id: "glos-002",
    owner_id: "user-001",
    name: "Thuật ngữ Hợp đồng & Pháp lý",
    source_lang: "English",
    target_lang: "Tiếng Việt",
    created_at: "2026-09-02T10:00:00Z",
    updated_at: "2026-09-12T11:20:00Z",
    terms: [
      { id: "t-201", glossary_id: "glos-002", source: "indemnification", target: "bồi thường thiệt hại", created_at: "2026-09-02T10:00:00Z", updated_at: "2026-09-02T10:00:00Z" },
      { id: "t-202", glossary_id: "glos-002", source: "force majeure", target: "sự kiện bất khả kháng", created_at: "2026-09-02T10:10:00Z", updated_at: "2026-09-02T10:10:00Z" },
      { id: "t-203", glossary_id: "glos-002", source: "intellectual property rights", target: "quyền sở hữu trí tuệ", created_at: "2026-09-03T09:30:00Z", updated_at: "2026-09-03T09:30:00Z" },
      { id: "t-204", glossary_id: "glos-002", source: "governing law", target: "luật điều chỉnh", created_at: "2026-09-04T14:15:00Z", updated_at: "2026-09-04T14:15:00Z" },
      { id: "t-205", glossary_id: "glos-002", source: "termination for convenience", target: "đơn phương chấm dứt hợp đồng", created_at: "2026-09-05T16:00:00Z", updated_at: "2026-09-05T16:00:00Z" },
    ],
  },
  {
    id: "glos-003",
    owner_id: "user-001",
    name: "Thuật ngữ Tài chính & Ngân hàng",
    source_lang: "English",
    target_lang: "Tiếng Việt",
    created_at: "2026-09-05T08:30:00Z",
    updated_at: "2026-09-14T09:45:00Z",
    terms: [
      { id: "t-301", glossary_id: "glos-003", source: "amortization schedule", target: "lịch trình phân bổ / khấu hao", created_at: "2026-09-05T08:30:00Z", updated_at: "2026-09-05T08:30:00Z" },
      { id: "t-302", glossary_id: "glos-003", source: "working capital", target: "vốn lưu động", created_at: "2026-09-05T08:45:00Z", updated_at: "2026-09-05T08:45:00Z" },
      { id: "t-303", glossary_id: "glos-003", source: "earnings before interest and taxes", target: "lợi nhuận trước thuế và lãi vay (EBIT)", created_at: "2026-09-06T10:20:00Z", updated_at: "2026-09-06T10:20:00Z" },
      { id: "t-304", glossary_id: "glos-003", source: "cash flow statement", target: "báo cáo lưu chuyển tiền tệ", created_at: "2026-09-07T11:00:00Z", updated_at: "2026-09-07T11:00:00Z" },
    ],
  },
];

let localGlossaries = [...MOCK_GLOSSARIES];

export const glossaryApi = {
  list: async (): Promise<GlossaryListItem[]> => {
    try {
      const res = await apiClient.get<GlossaryListItem[]>("/glossaries");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
    } catch {
      // Fallback to mock data
    }
    return localGlossaries.map(({ id, name, source_lang, target_lang, created_at, updated_at }) => ({
      id, name, source_lang, target_lang, created_at, updated_at
    }));
  },

  get: async (id: string): Promise<Glossary> => {
    try {
      const res = await apiClient.get<Glossary>(`/glossaries/${id}`);
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    const found = localGlossaries.find(g => g.id === id);
    return found ?? localGlossaries[0];
  },

  create: async (input: CreateGlossaryInput): Promise<Glossary> => {
    try {
      const res = await apiClient.post<Glossary>("/glossaries", input);
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    const newGlossary: Glossary = {
      id: `glos-${Date.now()}`,
      owner_id: "user-001",
      name: input.name,
      source_lang: input.source_lang,
      target_lang: input.target_lang,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      terms: (input.terms ?? []).map((t, idx) => ({
        id: `t-${Date.now()}-${idx}`,
        glossary_id: `glos-${Date.now()}`,
        source: t.source,
        target: t.target,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
    };
    localGlossaries = [newGlossary, ...localGlossaries];
    return newGlossary;
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/glossaries/${id}`);
    } catch {
      // Fallback
    }
    localGlossaries = localGlossaries.filter(g => g.id !== id);
  },

  addTerm: async ({ glossary_id, source, target }: AddTermInput): Promise<GlossaryTerm> => {
    try {
      const res = await apiClient.post<GlossaryTerm>(`/glossaries/${glossary_id}/terms`, { source, target });
      if (res.data) return res.data;
    } catch {
      // Fallback
    }
    const newTerm: GlossaryTerm = {
      id: `t-${Date.now()}`,
      glossary_id,
      source,
      target,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const glos = localGlossaries.find(g => g.id === glossary_id);
    if (glos) {
      glos.terms.push(newTerm);
    }
    return newTerm;
  },

  deleteTerm: async (glossary_id: string, term_id: string): Promise<void> => {
    try {
      await apiClient.delete(`/glossaries/${glossary_id}/terms/${term_id}`);
    } catch {
      // Fallback
    }
    const glos = localGlossaries.find(g => g.id === glossary_id);
    if (glos) {
      glos.terms = glos.terms.filter(t => t.id !== term_id);
    }
  },
};
