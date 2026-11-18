import { useEffect, useRef, useState } from "react";
import mementoMark from "./assets/memento-mark.png";
import { noteLabel } from "./demoData";

export function Wordmark() {
  return (
    <span className="wordmark" aria-label="Memento">
      <img src={mementoMark} alt="" width="30" height="32" />
      <span aria-hidden="true">M<b>E</b>M<b>E</b>NT<i>O</i></span>
    </span>
  );
}

export function Icon({ name }) {
  return <span className={`icon icon-${name}`} aria-hidden="true" />;
}

export function EmptyState({ title, children }) {
  return <div className="empty"><Icon name="file" /><h2>{title}</h2><p>{children}</p></div>;
}

export function ReadStatus({ resource, label }) {
  if (resource.loading) return <p className="read-status" role="status">Cargando {label}…</p>;
  if (!resource.error) return null;
  return (
    <div className="read-status">
      <p role="alert">No se pudo cargar {label}. {resource.error}</p>
      <button className="button" onClick={resource.retry}>Reintentar</button>
    </div>
  );
}

function WriteStatus({ busy, error, pending }) {
  if (busy) return <p className="write-status" role="status">{pending}</p>;
  if (error) return <p className="write-status" role="alert">{error}</p>;
  return null;
}

export function ConfirmDialog({ prompt, onCancel, busy = false, error = "" }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    if (prompt && !element.open) element.showModal();
    if (!prompt && element.open) element.close();
  }, [prompt]);

  return (
    <dialog ref={dialog} aria-labelledby="confirm-title" aria-describedby="confirm-description"
      onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
      {prompt && (
        <>
          <h2 id="confirm-title">{prompt.title}</h2>
          <p id="confirm-description">{prompt.description}</p>
          <WriteStatus busy={busy} error={error} pending="Eliminando…" />
          <div className="actions">
            <button className="button" autoFocus disabled={busy} onClick={onCancel}>Cancelar</button>
            <button className="button primary" disabled={busy} onClick={prompt.confirm}>{prompt.action}</button>
          </div>
        </>
      )}
    </dialog>
  );
}

export function RemoveButton({ onClick, label }) {
  return <button className="icon-button remove-button" type="button" aria-label={label} title={label} onClick={onClick}><Icon name="trash" /></button>;
}

export function EditButton({ onClick, label }) {
  return <button className="icon-button edit-button" type="button" aria-label={label} title={label} onClick={onClick}>✎</button>;
}

export function CreateNameDialog({ title, initialValue = "", date = false, busy = false, error = "", onSave, onCancel }) {
  const [name, setName] = useState(initialValue);
  const dialog = useRef(null);
  const submitted = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  async function submit(event) {
    event.preventDefault();
    const title = name.trim();
    if (!title || busy || submitted.current) return;
    submitted.current = true;
    try {
      await onSave(title);
    } finally {
      submitted.current = false;
    }
  }

  return (
    <dialog ref={dialog} aria-labelledby="create-title"
      onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
      <h2 id="create-title">{title}</h2>
      <form onSubmit={submit}>
        <label className="name-field">
          {date ? "Fecha y hora" : "Nombre"}
          <input type={date ? "datetime-local" : "text"} autoFocus required disabled={busy}
            value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <WriteStatus busy={busy} error={error} pending="Guardando…" />
        <div className="actions">
          <button className="button" type="button" disabled={busy} onClick={onCancel}>Cancelar</button>
          <button className="button primary" type="submit" disabled={busy || !name.trim()}>Guardar</button>
        </div>
      </form>
    </dialog>
  );
}

function SortableTreeRow({ as: Tag, item, siblings, bookId = null, selected, order, children }) {
  const handle = useRef(null);
  const index = siblings.findIndex((sibling) => sibling.id === item.id);
  const canMove = siblings.length > 1;
  const controlsOpen = order.controlsId === item.id;
  const dropPlacement = order.target?.id === item.id ? order.target.placement : null;
  const acceptsDrop = order.source && order.source.bookId === bookId && order.source.item.id !== item.id;

  function placementAt(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
  }

  function moveByStep(offset) {
    order.move(bookId, item, siblings[index + offset], offset < 0 ? "before" : "after");
    order.setControlsId(null);
    requestAnimationFrame(() => handle.current?.focus());
  }

  return (
    <Tag className={`tree-row ${selected ? "selected" : ""}`} data-drop-placement={dropPlacement}
      onDragOver={(event) => {
        if (!acceptsDrop) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        const placement = placementAt(event);
        order.setTarget((current) => current?.id === item.id && current.placement === placement
          ? current : { id: item.id, placement });
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          order.setTarget((current) => current?.id === item.id ? null : current);
        }
      }}
      onDrop={(event) => {
        if (!acceptsDrop) return;
        event.preventDefault();
        order.move(bookId, order.source.item, item, placementAt(event));
        order.endDrag();
      }}>
      <div className="reorder" onBlur={(event) => {
        if (controlsOpen && !event.currentTarget.contains(event.relatedTarget)) order.setControlsId(null);
      }} onKeyDown={(event) => {
        if (event.key !== "Escape" || !controlsOpen) return;
        event.stopPropagation();
        order.setControlsId(null);
        handle.current?.focus();
      }}>
        <div className="drag-handle-wrapper" draggable={canMove}
          title={canMove ? "Arrastrar o abrir controles de orden" : "No hay otros elementos para reordenar"}
          onClick={() => {
            if (!canMove) return;
            order.setControlsId(controlsOpen ? null : item.id);
            handle.current?.focus();
          }}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", item.id);
            order.startDrag(item, bookId);
          }}
          onDragEnd={order.endDrag}>
          <button ref={handle} type="button" className="icon-button drag-handle"
            aria-label={`Reordenar ${item.title}`} disabled={!canMove} aria-expanded={controlsOpen}
            aria-controls={`order-${item.id}`}>
            <span aria-hidden="true" className="grip" />
          </button>
        </div>
        <div id={`order-${item.id}`} className="reorder-controls" hidden={!controlsOpen} role="group" aria-label={`Mover ${item.title}`}>
          <button type="button" className="button" disabled={index === 0} onClick={() => moveByStep(-1)}>↑ Subir</button>
          <button type="button" className="button" disabled={index === siblings.length - 1} onClick={() => moveByStep(1)}>↓ Bajar</button>
        </div>
      </div>
      {children}
    </Tag>
  );
}

export function NotebookSidebar({ notebooks, topics, expanded, activeTopic, topicReads, notebookRead, hasWorkspace, onToggle, onTopic, onDelete, onEdit, onClose, closeButtonRef, onCreateNotebook, onCreateTopic, onReorder }) {
  const [source, setSource] = useState(null);
  const [target, setTarget] = useState(null);
  const [controlsId, setControlsId] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  const order = {
    source, target, setTarget, controlsId, setControlsId,
    startDrag(item, bookId) {
      setControlsId(null);
      setSource({ item, bookId });
    },
    endDrag() {
      setSource(null);
      setTarget(null);
    },
    move(bookId, item, destination, placement) {
      onReorder(bookId, item.id, destination.id, placement);
      setAnnouncement(`${item.title}: ${placement === "before" ? "antes de" : "después de"} ${destination.title}.`);
    },
  };

  return (
    <aside id="notebook-sidebar" className="sidebar" aria-label="Cuadernos y temas">
      <div className="sidebar-heading">
        <h2>Cuadernos</h2>
        <button ref={closeButtonRef} className="icon-button mobile-close" aria-label="Cerrar navegación" onClick={onClose}>×</button>
      </div>
      {onCreateNotebook && <button className="button sidebar-create" onClick={onCreateNotebook}>+ Nuevo cuaderno</button>}
      {hasWorkspace && notebooks.length === 0 && !notebookRead.loading && !notebookRead.error &&
        <p className="sidebar-empty">Todavía no hay cuadernos.</p>}
      <ul className="tree">
        {notebooks.map((notebook) => {
          const isOpen = expanded.includes(notebook.id);
          const children = topics.filter((topic) => topic.bookId === notebook.id);
          const read = topicReads?.[notebook.id];
          return (
            <li key={notebook.id}>
              <SortableTreeRow as="div" item={notebook} siblings={notebooks} order={order}>
                <button className="tree-button" aria-expanded={isOpen} aria-controls={`topics-${notebook.id}`} onClick={() => onToggle(notebook.id)}>
                  <span className={`chevron ${isOpen ? "open" : ""}`} aria-hidden="true" />
                  <Icon name="folder" /><span>{notebook.title}</span>
                </button>
                {onCreateTopic && <button className="icon-button add-topic" type="button" aria-label={`Nuevo tema en ${notebook.title}`}
                  title="Nuevo tema" onClick={() => onCreateTopic(notebook.id)}>+</button>}
                <EditButton label={`Editar cuaderno ${notebook.title}`} onClick={() => onEdit("notebook", notebook)} />
                {onDelete && <RemoveButton label={`Eliminar cuaderno ${notebook.title}`} onClick={() => onDelete("notebook", notebook)} />}
              </SortableTreeRow>
              <ul id={`topics-${notebook.id}`} className="topic-tree" hidden={!isOpen}>
                {read?.loading || read?.error ? <li><ReadStatus resource={read} label="temas" /></li> :
                  children.length === 0 && <li className="sidebar-empty">Todavía no hay temas.</li>}
                {children.map((topic) => (
                  <SortableTreeRow as="li" item={topic} siblings={children} bookId={notebook.id}
                    selected={activeTopic === topic.id} order={order} key={topic.id}>
                    <button className="tree-button" aria-current={activeTopic === topic.id ? "page" : undefined} onClick={() => onTopic(topic.id)}>
                      <Icon name="topic" /><span>{topic.title}</span>
                    </button>
                    <EditButton label={`Editar tema ${topic.title}`} onClick={() => onEdit("topic", topic)} />
                    {onDelete && <RemoveButton label={`Eliminar tema ${topic.title}`} onClick={() => onDelete("topic", topic)} />}
                  </SortableTreeRow>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <span className="visually-hidden" role="status">{announcement}</span>
    </aside>
  );
}

export function TopicNotesList({ notes, search, onSearch, onOpen, onDelete, onCreate }) {
  const query = search.trim().toLocaleLowerCase("es");
  const visible = notes.filter((note) => (note.content?.body ?? "").toLocaleLowerCase("es").includes(query));
  return (
    <section aria-label="Notas del tema">
      <div className="list-heading">
        <p>{notes.length === 1 ? "1 nota" : `${notes.length} notas`}</p>
        <div className="actions">
          {notes.length > 0 && <label className="search"><Icon name="search" /><input type="search" aria-label="Buscar en las notas del tema" placeholder="Buscar notas" value={search} onChange={(event) => onSearch(event.target.value)} /></label>}
          {onCreate && <button className="button primary" onClick={onCreate}>+ Nueva nota</button>}
        </div>
      </div>
      {visible.length === 0 && (
        <EmptyState title={notes.length ? "Sin resultados" : "Todavía no hay notas"}>
          {notes.length ? "Prueba con otras palabras." : "Las notas de este tema aparecerán aquí."}
        </EmptyState>
      )}
      <ul className="note-list">
        {visible.map((note) => {
          const preview = note.content?.body?.trim().split(/\r?\n/).slice(1).join(" ").trim();
          return (
            <li className="note-row" key={note.id}>
              <button className="note-link" onClick={() => onOpen(note.id)}>
                <span className="note-icon"><Icon name="file" /></span>
                <span className="note-summary"><strong>{noteLabel(note)}</strong>{preview && <span>{preview}</span>}</span>
                <span className="chevron" aria-hidden="true" />
              </button>
              {onDelete && <RemoveButton label={`Eliminar nota ${noteLabel(note)}`} onClick={() => onDelete("note", note)} />}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function NotePage({ note, draft, busy = false, error = "", onDraft, onEdit, onSave, onCancel, onBack, onDelete }) {
  const editing = draft !== null;
  return (
    <section aria-label="Hoja de notas">
      <div className="note-toolbar">
        <button className="button back-button" disabled={busy} onClick={onBack}><span aria-hidden="true">←</span> Volver a las notas</button>
        <div className="actions">
          {editing ? (
            <>
              <button className="button" disabled={busy} onClick={onCancel}>Cancelar</button>
              <button className="button primary" onClick={onSave} disabled={busy || (!note && !draft.trim())}>Guardar</button>
            </>
          ) : (
            <>
              {onDelete && <RemoveButton label="Eliminar nota abierta" onClick={onDelete} />}
              <button className="button primary" onClick={onEdit}>Editar nota</button>
            </>
          )}
        </div>
      </div>
      <WriteStatus busy={busy} error={error} pending="Guardando…" />
      <article className="paper">
        {editing
          ? <textarea autoFocus aria-label="Contenido de la nota" value={draft} readOnly={busy} onChange={(event) => onDraft(event.target.value)} />
          : <div className="note-body">{note.content?.body || <span className="muted">Esta nota está vacía.</span>}</div>}
      </article>
    </section>
  );
}
