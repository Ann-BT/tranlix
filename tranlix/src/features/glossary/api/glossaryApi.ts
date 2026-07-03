import { apiClient } from "@shared/api/client";
import type { Glossary, GlossaryListItem, CreateGlossaryInput, AddTermInput, GlossaryTerm } from "../types";

export const glossaryApi = {
  list: (): Promise<GlossaryListItem[]> =>
    apiClient.get<GlossaryListItem[]>("/glossaries").then((r) => r.data),

  get: (id: string): Promise<Glossary> =>
    apiClient.get<Glossary>(`/glossaries/${id}`).then((r) => r.data),

  create: (input: CreateGlossaryInput): Promise<Glossary> =>
    apiClient.post<Glossary>("/glossaries", input).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/glossaries/${id}`).then(() => undefined),

  addTerm: ({ glossary_id, source, target }: AddTermInput): Promise<GlossaryTerm> =>
    apiClient
      .post<GlossaryTerm>(`/glossaries/${glossary_id}/terms`, { source, target })
      .then((r) => r.data),

  deleteTerm: (glossary_id: string, term_id: string): Promise<void> =>
    apiClient.delete(`/glossaries/${glossary_id}/terms/${term_id}`).then(() => undefined),
};
