export interface GlossaryTerm {
  id: string;
  glossary_id: string;
  source: string;
  target: string;
  created_at: string;
  updated_at: string;
}

export interface Glossary {
  id: string;
  owner_id: string | null;
  name: string;
  source_lang: string;
  target_lang: string;
  terms: GlossaryTerm[];
  created_at: string;
  updated_at: string;
}

export interface GlossaryListItem {
  id: string;
  name: string;
  source_lang: string;
  target_lang: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGlossaryInput {
  name: string;
  source_lang: string;
  target_lang: string;
  terms?: { source: string; target: string }[];
}

export interface AddTermInput {
  glossary_id: string;
  source: string;
  target: string;
}
