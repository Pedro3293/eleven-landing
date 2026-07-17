/** Base de conocimiento del entrenador IA (D-12): entradas curadas en español. */

export type KnowledgeCategory = 'ciencia' | 'metodologia' | 'acondicionamiento' | 'salud';

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  title: string;
  /** Palabras y sinónimos por los que se recupera la entrada (minúsculas, sin tildes). */
  keywords: string[];
  /** Contenido en español, directo y accionable. En 'salud' SIEMPRE incluye derivación. */
  content: string;
}
