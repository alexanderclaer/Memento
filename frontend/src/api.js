const segment = (value) => encodeURIComponent(value);
const collections = {
  workspace: "/api/workspaces",
  notebook: "/api/notebook",
  topic: "/api/topics",
  note: "/api/notes",
};

export const routes = {
  workspaces: (userId) => `/api/workspaces/user/${segment(userId)}`,
  notebooks: (workspaceId) => `/api/notebook/workspace/${segment(workspaceId)}`,
  topics: (notebookId) => `/api/topics/notebook/${segment(notebookId)}`,
  notes: (topicId) => `/api/notes/topic/${segment(topicId)}`,
  note: (noteId) => `/api/notes/${segment(noteId)}`,
};

async function requestJson(path, { signal, list = false, method = "GET", body, contentType } = {}) {
  let response;
  let responseBody;
  try {
    const headers = { Accept: "application/json" };
    if (contentType) headers["Content-Type"] = contentType;
    response = await fetch(path, { method, headers, body, signal });
    if (response.ok) responseBody = (await response.text()).trim();
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("No se pudo conectar con la API de Memento.");
  }

  if (!response.ok) {
    if (response.status === 404) throw new Error("El recurso solicitado ya no está disponible (404).");
    throw new Error(`La API no pudo completar la operación (HTTP ${response.status}).`);
  }
  if (!responseBody) return list ? [] : null;

  try {
    const data = JSON.parse(responseBody);
    if (list && !Array.isArray(data)) throw new Error();
    if (!list && (!data || typeof data !== "object" || Array.isArray(data))) throw new Error();
    return data;
  } catch {
    throw new Error("La API devolvió una respuesta inesperada.");
  }
}

export function readJson(path, options) {
  return requestJson(path, options);
}

export function createRecord(kind, record) {
  return requestJson(collections[kind], {
    method: "POST", contentType: "application/json", body: JSON.stringify(record),
  });
}

export function patchText(kind, id, value) {
  const field = { workspace: "name", notebook: "title", topic: "title", note: "body" }[kind];
  return requestJson(`${collections[kind]}/${segment(id)}/${field}`, {
    method: "PATCH", contentType: "text/plain; charset=UTF-8", body: value,
  });
}

export function patchTopicDate(id, date) {
  return requestJson(`${collections.topic}/${segment(id)}/date?date=${segment(date)}`, { method: "PATCH" });
}

export function deleteRecord(kind, id) {
  return requestJson(`${collections[kind]}/${segment(id)}`, { method: "DELETE" });
}
