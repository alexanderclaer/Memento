import { useEffect, useRef, useState } from "react";
import { ConfirmDialog, CreateNameDialog, EditButton, EmptyState, Icon, NotebookSidebar, NotePage, ReadStatus, RemoveButton, TopicNotesList, Wordmark } from "./components";
import { createRecord, deleteRecord, patchText, patchTopicDate, routes } from "./api";
import { useApiRead, useTopicLists } from "./useApiReads";
import { demoData, noteLabel, removeBranch, reorderSiblings } from "./demoData";
import "./App.css";

const deleteDescriptions = {
  workspace: "Se eliminarán el workspace y todos sus cuadernos, temas y notas.",
  notebook: "Se eliminarán el cuaderno y todos sus temas y notas.",
  topic: "Se eliminarán el tema y todas sus notas.",
  note: "Se eliminará esta nota.",
};

const apiMode = import.meta.env.VITE_MEMENTO_MODE === "api";
const userId = import.meta.env.VITE_MEMENTO_USER_ID?.trim();
const workspaceKey = `memento:api:workspace:${userId}`;
const entityNames = { workspace: "workspace", notebook: "cuaderno", topic: "tema" };

function updateItem(items, id, record) {
  if (!record) return items.filter((item) => item.id !== id);
  return items.map((item) => item.id === id ? { ...item, ...record } : item);
}

function localDate(value) {
  const date = new Date(value ?? "");
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function workspacePreference(id) {
  try {
    if (id !== undefined) window.localStorage.setItem(workspaceKey, id);
    else return window.localStorage.getItem(workspaceKey);
  } catch {
    return null;
  }
}

function ordered(items, ids) {
  if (!ids) return items;
  const byId = new Map(items.map((item) => [item.id, item]));
  const known = ids.filter((id) => byId.has(id)).map((id) => byId.get(id));
  const saved = new Set(ids);
  return [...known, ...items.filter((item) => !saved.has(item.id))];
}

export default function App() {
  const [data, setData] = useState(demoData);
  const [workspaceId, setWorkspaceId] = useState(() => apiMode ? workspacePreference() : "academico");
  const [topicId, setTopicId] = useState(apiMode ? null : "limites");
  const [noteId, setNoteId] = useState(null);
  const [expanded, setExpanded] = useState(apiMode ? [] : ["calculo"]);
  const [apiOrder, setApiOrder] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [nameForm, setNameForm] = useState(null);
  const [write, setWrite] = useState({ busy: false, error: "" });
  const writing = useRef(false);
  const nextLocalId = useRef(0);
  const newNoteId = useRef(null);
  const main = useRef(null);
  const menuButton = useRef(null);
  const closeButton = useRef(null);

  const workspaceRead = useApiRead(apiMode && userId ? routes.workspaces(userId) : null);
  const workspaces = apiMode ? workspaceRead.data ?? [] : data.workspaces;
  const workspace = workspaces.find((item) => item.id === workspaceId)
    ?? (apiMode && workspaces.length === 1 ? workspaces[0] : undefined);
  const notebookRead = useApiRead(apiMode && workspace ? routes.notebooks(workspace.id) : null);
  const notebookOrderKey = `workspace:${workspace?.id}`;
  const notebooks = apiMode
    ? ordered(notebookRead.data ?? [], apiOrder[notebookOrderKey])
    : data.notebooks.filter((item) => item.workspaceId === workspace?.id);
  const { results: topicReads, load: loadTopics, update: updateTopics } = useTopicLists(workspace?.id);
  const topics = apiMode
    ? notebooks.flatMap((book) => ordered(topicReads[book.id]?.data ?? [], apiOrder[`notebook:${book.id}`]))
    : data.topics;
  const topic = topics.find((item) => item.id === topicId && notebooks.some((notebook) => notebook.id === item.bookId));
  const notebook = notebooks.find((item) => item.id === topic?.bookId);
  const notesRead = useApiRead(apiMode && topic ? routes.notes(topic.id) : null);
  const notes = apiMode ? notesRead.data ?? [] : data.notes.filter((item) => item.topicId === topic?.id);
  const noteRead = useApiRead(apiMode && topic && noteId ? routes.note(noteId) : null, false);
  const note = apiMode ? noteRead.data : notes.find((item) => item.id === noteId);
  const dirty = draft !== null && draft !== (note?.content?.body ?? "");

  useEffect(() => {
    if (!dirty) return;
    function warn(event) {
      event.preventDefault();
      event.returnValue = true;
    }
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (mobileOpen) closeButton.current?.focus();
  }, [mobileOpen]);

  function closeNavigation() {
    setMobileOpen(false);
    requestAnimationFrame(() => menuButton.current?.focus());
  }

  function focusMain() {
    requestAnimationFrame(() => main.current?.focus());
  }

  function leaveNote(next) {
    if (writing.current) return;
    function proceed() {
      setDraft(null);
      newNoteId.current = null;
      setPrompt(null);
      setWrite({ busy: false, error: "" });
      next();
      focusMain();
    }
    if (dirty) {
      setPrompt({
        title: "¿Descartar los cambios?",
        description: "La nota tiene cambios sin guardar. Si sales de la edición, se perderá el borrador.",
        action: "Descartar cambios",
        confirm: proceed,
      });
    } else {
      proceed();
    }
  }

  async function writeRecord(operation, onSuccess, failureHint = "") {
    if (writing.current) return;
    writing.current = true;
    setWrite({ busy: true, error: "" });
    try {
      const result = await operation();
      onSuccess(result);
      setWrite({ busy: false, error: "" });
    } catch (error) {
      setWrite({ busy: false, error: error.message + failureHint });
    } finally {
      writing.current = false;
    }
  }

  function selectTopic(id) {
    if (id === topic?.id && noteId === null && draft === null) {
      if (mobileOpen) closeNavigation();
      return;
    }
    leaveNote(() => {
      setTopicId(id);
      setNoteId(null);
      setSearch("");
      setMobileOpen(false);
    });
  }

  function selectWorkspace(id) {
    leaveNote(() => {
      if (apiMode) workspacePreference(id);
      setWorkspaceId(id);
      setTopicId(null);
      setNoteId(null);
      setExpanded([]);
      setSearch("");
    });
  }

  function toggleNotebook(id) {
    if (apiMode && !expanded.includes(id) && !topicReads[id]?.data && !topicReads[id]?.error) loadTopics(id);
    setExpanded((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function reorderNavigation(bookId, sourceId, targetId, placement) {
    if (apiMode) {
      const key = bookId === null ? notebookOrderKey : `notebook:${bookId}`;
      const siblings = bookId === null ? notebooks : topics.filter((item) => item.bookId === bookId);
      setApiOrder((current) => ({
        ...current,
        [key]: reorderSiblings(ordered(siblings, current[key]), () => true, sourceId, targetId, placement).map((item) => item.id),
      }));
      return;
    }
    const collection = bookId === null ? "notebooks" : "topics";
    const belongsToGroup = bookId === null
      ? (item) => item.workspaceId === workspaceId
      : (item) => item.bookId === bookId;
    setData((current) => ({
      ...current,
      [collection]: reorderSiblings(current[collection], belongsToGroup, sourceId, targetId, placement),
    }));
  }

  function openForm(form) {
    if (writing.current) return;
    setWrite({ busy: false, error: "" });
    setNameForm(form);
  }

  function rename(kind, item) {
    openForm({ kind, item, title: `Cambiar nombre del ${entityNames[kind]}`, initialValue: item.name ?? item.title });
  }

  function saveName(title) {
    const { kind, item, bookId, date } = nameForm;
    if (date) {
      return writeRecord(() => patchTopicDate(item.id, new Date(title).toISOString()), (saved) => {
        updateTopics(item.bookId, (items) => updateItem(items, item.id, saved ?? { topicDate: new Date(title).toISOString() }));
        setNameForm(null);
      });
    }

    const record = kind === "workspace"
      ? { name: title, usersId: [userId] }
      : kind === "notebook" ? { title, workspaceId: workspace?.id } : { title, bookId };

    if (apiMode) {
      return writeRecord(() => item ? patchText(kind, item.id, title) : createRecord(kind, record), (saved) => {
        const fallback = kind === "workspace" ? { name: title } : { title };
        const change = (items) => item ? updateItem(items, item.id, saved ?? fallback) : [...items, saved];
        if (kind === "workspace") {
          if (!item && workspace) setWorkspaceId(workspace.id);
          if (item || saved?.id) workspaceRead.update(change);
          else workspaceRead.retry();
        } else if (kind === "notebook") {
          if (item || saved?.id) notebookRead.update(change);
          else notebookRead.retry();
        } else {
          const parent = item?.bookId ?? bookId;
          if (topicReads[parent]?.data && (item || saved?.id)) updateTopics(parent, change);
          else loadTopics(parent, true);
          setExpanded((current) => current.includes(parent) ? current : [...current, parent]);
        }
        setNameForm(null);
      }, item ? "" : " Consulta la lista antes de repetir una creación si la respuesta se perdió.");
    }

    const collection = { workspace: "workspaces", notebook: "notebooks", topic: "topics" }[kind];
    if (item) {
      const fields = kind === "workspace" ? { name: title } : { title };
      setData((current) => ({ ...current, [collection]: updateItem(current[collection], item.id, fields) }));
      setNameForm(null);
      return;
    }
    const id = `local-${++nextLocalId.current}`;
    setData((current) => ({ ...current, [collection]: [...current[collection], { id, ...record }] }));
    if (kind === "topic") {
      setExpanded((current) => current.includes(bookId) ? current : [...current, bookId]);
    } else if (kind === "workspace" && !workspace) {
      setWorkspaceId(id);
    }
    setNameForm(null);
  }

  function startNote() {
    if (!apiMode) newNoteId.current = `local-${++nextLocalId.current}`;
    setWrite({ busy: false, error: "" });
    setDraft("");
  }

  function saveNote() {
    const content = { body: draft, format: "MARKDOWN", attachments: [] };
    if (apiMode) {
      if (writing.current || draft === null) return;
      if (note && draft === "") {
        setWrite({ busy: false, error: "La API actual requiere un cuerpo de texto. La nota guardada se mantuvo intacta." });
        return;
      }
      if (!note && !draft.trim()) return;
      return writeRecord(() => note
        ? patchText("note", note.id, draft)
        : createRecord("note", { topicId, noteType: "TEXT", content }), (saved) => {
        if (note) {
          const updated = { content: { ...note.content, body: draft } };
          noteRead.update((current) => ({ ...current, ...updated }));
          notesRead.update((items) => updateItem(items, note.id, updated));
        } else {
          if (saved?.id) notesRead.update((items) => [...items, saved]);
          else notesRead.retry();
          setSearch("");
        }
        setDraft(null);
        focusMain();
      }, note ? "" : " Consulta la lista antes de repetir una creación si la respuesta se perdió.");
    }
    if (note) {
      setData((current) => ({
        ...current,
        notes: current.notes.map((item) => item.id === note.id
          ? { ...item, content: { ...item.content, body: draft } }
          : item),
      }));
    } else {
      const id = newNoteId.current;
      if (!id || !draft.trim()) return;
      newNoteId.current = null;
      const newNote = { id, topicId, noteType: "TEXT", content };
      setData((current) => ({ ...current, notes: [...current.notes, newNote] }));
      setSearch("");
    }
    setDraft(null);
    focusMain();
  }

  function requestDelete(kind, item) {
    if (writing.current) return;
    setWrite({ busy: false, error: "" });
    const label = kind === "note" ? noteLabel(item) : item.title ?? item.name;
    if (apiMode) {
      const clearsWorkspace = kind === "workspace" && item.id === workspace?.id;
      const clearsTopic = clearsWorkspace || (kind === "notebook" && item.id === topic?.bookId)
        || (kind === "topic" && item.id === topic?.id);
      const clearsNote = clearsTopic || (kind === "note" && item.id === noteId);
      const removesItem = (items) => updateItem(items, item.id, null);
      setPrompt({
        title: `¿Eliminar «${label}»?`,
        description: deleteDescriptions[kind] + (clearsNote && dirty ? " También se perderán los cambios sin guardar de la nota abierta." : ""),
        action: "Eliminar",
        confirm: () => writeRecord(() => deleteRecord(kind, item.id), () => {
          if (kind === "workspace") workspaceRead.update(removesItem);
          if (kind === "notebook") notebookRead.update(removesItem);
          if (kind === "topic") updateTopics(item.bookId, removesItem);
          if (kind === "note") notesRead.update(removesItem);
          if (clearsWorkspace) {
            workspacePreference("");
            setWorkspaceId(null);
            setExpanded([]);
          } else if (kind === "notebook") {
            setExpanded((current) => current.filter((id) => id !== item.id));
          }
          if (clearsTopic) {
            setTopicId(null);
            setSearch("");
          }
          if (clearsNote) {
            setNoteId(null);
            setDraft(null);
          }
          setPrompt(null);
          setMobileOpen(false);
          focusMain();
        }, kind === "note" ? "" : " La cascada puede haber quedado incompleta. Recarga para consultar el estado del servidor."),
      });
      return;
    }
    const next = removeBranch(data, kind, item.id);
    const removesOpenNote = note && !next.notes.some((entry) => entry.id === note.id);
    const removesActiveTopic = topic && !next.topics.some((entry) => entry.id === topic.id);
    const discardsDraft = removesOpenNote || removesActiveTopic;
    setPrompt({
      title: `¿Eliminar «${label}»?`,
      description: deleteDescriptions[kind] + (discardsDraft && dirty ? " También se perderán los cambios sin guardar de la nota abierta." : ""),
      action: "Eliminar",
      confirm: () => {
        setData(next);
        if (!next.workspaces.some((entry) => entry.id === workspaceId)) {
          setWorkspaceId(next.workspaces[0]?.id ?? null);
          setExpanded([]);
        }
        if (!next.topics.some((entry) => entry.id === topicId)) {
          setTopicId(null);
          setSearch("");
        }
        if (discardsDraft) {
          setNoteId(null);
          setDraft(null);
          newNoteId.current = null;
        }
        setPrompt(null);
        if (mobileOpen) {
          setMobileOpen(false);
        }
        focusMain();
      },
    });
  }

  function emptyContent() {
    if (apiMode && !userId) {
      return <EmptyState title="Falta configurar el usuario">Define VITE_MEMENTO_USER_ID para consultar sus workspaces.</EmptyState>;
    }
    if (workspaceRead.loading || workspaceRead.error) return <ReadStatus resource={workspaceRead} label="workspaces" />;
    if (!workspace && workspaces.length) return <EmptyState title="Selecciona un workspace">Elige un workspace en la cabecera.</EmptyState>;
    if (!workspace) return <EmptyState title="Todavía no hay workspaces">Tus espacios de trabajo aparecerán aquí.</EmptyState>;
    if (notebookRead.loading || notebookRead.error) return <ReadStatus resource={notebookRead} label="cuadernos" />;
    if (!notebooks.length) return <EmptyState title="Todavía no hay cuadernos">Los cuadernos de este workspace aparecerán en la barra lateral.</EmptyState>;
    const hasTopics = apiMode
      ? notebooks.some((book) => !topicReads[book.id]?.data || topicReads[book.id].data.length > 0)
      : topics.some((item) => notebooks.some((book) => book.id === item.bookId));
    return hasTopics
      ? <EmptyState title="Selecciona un tema">Abre un cuaderno en la barra lateral para encontrar sus temas.</EmptyState>
      : <EmptyState title="Todavía no hay temas">Los temas aparecerán al expandir sus cuadernos.</EmptyState>;
  }

  return (
    <div className={`app ${mobileOpen ? "navigation-open" : ""}`} onKeyDown={(event) => {
      if (event.key === "Escape" && mobileOpen && !prompt && !nameForm) closeNavigation();
    }}>
      <header className="topbar">
        <button ref={menuButton} className="icon-button mobile-menu" aria-label="Abrir navegación" aria-controls="notebook-sidebar" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Icon name="menu" /></button>
        <div className="brand">
          <Wordmark />
          <span className="mode-label">{apiMode ? "API" : "Demostración"}</span>
        </div>
        <div className="workspace">
          <span className="workspace-icon" aria-hidden="true">{workspace?.name?.charAt(0) || "M"}</span>
          <div>
            <small>Workspace activo</small>
            {workspaces.length > 1 ? (
              <select aria-label="Workspace activo" value={workspace?.id ?? ""} onChange={(event) => selectWorkspace(event.target.value)}>
                <option value="" disabled>Seleccionar workspace</option>
                {workspaces.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            ) : <strong>{workspace?.name ?? "Sin workspace"}</strong>}
          </div>
          {(!apiMode || workspaceRead.data) && <button className="icon-button add-topic" aria-label="Nuevo workspace"
            title="Nuevo workspace" onClick={() => openForm({ kind: "workspace", title: "Nuevo workspace" })}>+</button>}
          {workspace && <EditButton label="Editar workspace activo" onClick={() => rename("workspace", workspace)} />}
          {workspace && <RemoveButton label="Eliminar workspace activo" onClick={() => requestDelete("workspace", workspace)} />}
        </div>
      </header>
      <div className="layout">
        {mobileOpen && <button className="scrim" tabIndex={-1} aria-label="Cerrar navegación" onClick={closeNavigation} />}
        <NotebookSidebar notebooks={notebooks} topics={topics} expanded={expanded} activeTopic={topic?.id}
          topicReads={apiMode ? topicReads : undefined} notebookRead={notebookRead} hasWorkspace={!!workspace}
          onCreateNotebook={workspace && !notebookRead.loading && !notebookRead.error
            ? () => openForm({ kind: "notebook", title: "Nuevo cuaderno" }) : undefined}
          onCreateTopic={(bookId) => openForm({ kind: "topic", title: "Nuevo tema", bookId })}
          onEdit={rename}
          onReorder={reorderNavigation}
          onToggle={toggleNotebook} onTopic={selectTopic} onDelete={requestDelete} onClose={closeNavigation} closeButtonRef={closeButton} />
        <main ref={main} className="main" tabIndex={-1}>
          <div className="content">
            {topic ? (
              <>
                <p className="breadcrumbs"><Icon name="folder" /><span>{notebook.title}</span><span className="chevron" aria-hidden="true" /><span>{topic.title}</span></p>
                {apiMode && noteId && !note ? (
                  <>
                    <button className="button back-button" onClick={() => leaveNote(() => setNoteId(null))}>← Volver a las notas</button>
                    {noteRead.loading || noteRead.error ? <ReadStatus resource={noteRead} label="nota" /> :
                      <EmptyState title="Nota no disponible">Vuelve a la lista para abrir otra nota.</EmptyState>}
                  </>
                ) : note || draft !== null ? <NotePage note={note} draft={draft} onDraft={setDraft}
                  onEdit={() => setDraft(note.content?.body ?? "")} onSave={saveNote} {...write}
                  onCancel={() => leaveNote(() => {})}
                  onBack={() => leaveNote(() => setNoteId(null))}
                  onDelete={() => requestDelete("note", note)} /> : (
                  <>
                    <header className="page-heading"><span className="topic-emblem"><Icon name="topic" /></span><h1>{topic.title}</h1></header>
                    {apiMode && <button className="button topic-date-action" onClick={() => openForm({
                      title: "Cambiar fecha del tema", item: topic, date: true, initialValue: localDate(topic.topicDate),
                    })}>Cambiar fecha del tema</button>}
                    {notesRead.loading || notesRead.error ? <ReadStatus resource={notesRead} label="notas" /> :
                      <TopicNotesList notes={notes} search={search} onSearch={setSearch}
                        onCreate={startNote}
                        onOpen={(id) => { setNoteId(id); focusMain(); }} onDelete={requestDelete} />}
                  </>
                )}
              </>
            ) : emptyContent()}
          </div>
        </main>
      </div>
      <ConfirmDialog prompt={prompt} {...(prompt?.action === "Eliminar" ? write : {})} onCancel={() => setPrompt(null)} />
      {nameForm && <CreateNameDialog {...nameForm} {...write} onSave={saveName} onCancel={() => setNameForm(null)} />}
    </div>
  );
}
