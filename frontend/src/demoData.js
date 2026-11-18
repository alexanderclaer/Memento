export const demoData = {
  workspaces: [{ id: "academico", name: "Espacio académico", usersId: ["estudiante"] }],
  notebooks: [
    { id: "calculo", title: "Cálculo I", workspaceId: "academico" },
    { id: "programacion", title: "Programación", workspaceId: "academico" },
    { id: "bases", title: "Bases de datos", workspaceId: "academico" },
    { id: "fisica", title: "Física general", workspaceId: "academico" },
  ],
  topics: [
    { id: "limites", title: "Límites y continuidad", bookId: "calculo", topicDate: "2026-10-28T12:00:00Z" },
    { id: "derivadas", title: "Derivadas", bookId: "calculo" },
    { id: "integrales", title: "Integrales", bookId: "calculo" },
    { id: "git", title: "Control de versiones", bookId: "programacion" },
    { id: "modelo", title: "Modelo relacional", bookId: "bases" },
  ],
  notes: [
    { id: "n1", topicId: "limites", noteType: "TEXT", content: { body: "Definición de límite\n\nUn límite describe el valor al que se acerca una función cuando x se aproxima a un punto.", format: "MARKDOWN", attachments: [] } },
    { id: "n2", topicId: "limites", noteType: "TEXT", content: { body: "Continuidad de una función\n\nUna función es continua si el límite coincide con su valor en el punto.", format: "MARKDOWN", attachments: [] } },
    { id: "n3", topicId: "limites", noteType: "TEXT", content: { body: "Ejercicios del taller\n\nRepasar límites laterales y practicar la factorización antes de sustituir.", format: "MARKDOWN", attachments: [] } },
    { id: "n4", topicId: "derivadas", noteType: "TEXT", content: { body: "Reglas de derivación\n\nRepasar las reglas del producto, del cociente y de la cadena.", format: "MARKDOWN", attachments: [] } },
    { id: "n5", topicId: "git", noteType: "TEXT", content: { body: "Repositorio y commits\n\nUn commit guarda un cambio del proyecto.", format: "MARKDOWN", attachments: [] } },
  ],
};

export function noteLabel(note) {
  return note.content?.body?.split(/\r?\n/).find((line) => line.trim())?.trim() || "Nota sin título";
}

export function reorderSiblings(items, belongsToGroup, sourceId, targetId, placement) {
  const siblings = items.filter(belongsToGroup);
  const source = siblings.find((item) => item.id === sourceId);
  if (!source || sourceId === targetId) return items;

  const ordered = siblings.filter((item) => item.id !== sourceId);
  const targetIndex = ordered.findIndex((item) => item.id === targetId);
  if (targetIndex === -1) return items;

  ordered.splice(targetIndex + (placement === "after" ? 1 : 0), 0, source);
  let index = 0;
  return items.map((item) => belongsToGroup(item) ? ordered[index++] : item);
}

export function removeBranch(data, kind, id) {
  const notebookIds = new Set(data.notebooks.filter((notebook) =>
    (kind === "notebook" && notebook.id === id) ||
    (kind === "workspace" && notebook.workspaceId === id)).map((notebook) => notebook.id));
  const topicIds = new Set(data.topics.filter((topic) =>
    (kind === "topic" && topic.id === id) || notebookIds.has(topic.bookId)).map((topic) => topic.id));

  return {
    workspaces: data.workspaces.filter((workspace) => kind !== "workspace" || workspace.id !== id),
    notebooks: data.notebooks.filter((notebook) => !notebookIds.has(notebook.id)),
    topics: data.topics.filter((topic) => !topicIds.has(topic.id)),
    notes: data.notes.filter((note) =>
      (kind !== "note" || note.id !== id) && !topicIds.has(note.topicId)),
  };
}
