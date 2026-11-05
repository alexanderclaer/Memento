import { useMemo, useState } from "react";
import "./App.css";

const CUADERNOS = [
  { id: "calculo", nombre: "Cálculo I" },
  { id: "programacion", nombre: "Taller de Programación" },
  { id: "bases", nombre: "Bases de Datos" },
  { id: "fisica", nombre: "Física General" },
];

const NOTAS = [
  {
    id: 1,
    cuaderno: "calculo",
    titulo: "Límites y continuidad",
    fecha: "28 oct 2026",
    etiquetas: ["examen", "teoría"],
    contenido:
      "Un límite describe el valor al que se acerca una función cuando x se aproxima a un punto. Una función es continua si el límite coincide con el valor de la función.",
  },
  {
    id: 2,
    cuaderno: "calculo",
    titulo: "Reglas de derivación",
    fecha: "30 oct 2026",
    etiquetas: ["práctica"],
    contenido:
      "Regla de la potencia, del producto, del cociente y de la cadena. Repasar los ejercicios 12 al 20 del taller.",
  },
  {
    id: 3,
    cuaderno: "programacion",
    titulo: "Repositorio y commits",
    fecha: "2 nov 2026",
    etiquetas: ["git", "entrega"],
    contenido:
      "Un commit guarda un cambio real del proyecto. Conviene escribir mensajes cortos que expliquen qué se hizo.",
  },
  {
    id: 4,
    cuaderno: "bases",
    titulo: "Modelo entidad-relación",
    fecha: "3 nov 2026",
    etiquetas: ["teoría", "diagrama"],
    contenido:
      "Entidades, atributos y relaciones. Cardinalidad uno a muchos entre Cuaderno y Nota.",
  },
  {
    id: 5,
    cuaderno: "fisica",
    titulo: "Leyes de Newton",
    fecha: "4 nov 2026",
    etiquetas: ["examen"],
    contenido:
      "Inercia, F = m·a y acción-reacción. Resolver los problemas de planos inclinados.",
  },
];

const ARCHIVOS = [
  { nombre: "guia-limites.pdf", cuaderno: "Cálculo I" },
  { nombre: "diagrama-er.png", cuaderno: "Bases de Datos" },
  { nombre: "formulas-fisica.jpg", cuaderno: "Física General" },
];

const NAV = [
  { id: "notas", texto: "Notas" },
  { id: "etiquetas", texto: "Etiquetas" },
  { id: "archivos", texto: "Archivos" },
  { id: "config", texto: "Configuración" },
];

function Wordmark() {
  return (
    <span className="wordmark" aria-label="Memento">
      <span className="c-negro">M</span>
      <span className="c-vino">E</span>
      <span className="c-negro">M</span>
      <span className="c-vino">E</span>
      <span className="c-negro">N</span>
      <span className="c-negro">T</span>
      <span className="c-verde">O</span>
    </span>
  );
}

export default function App() {
  const [vista, setVista] = useState("notas");
  const [cuaderno, setCuaderno] = useState("todos");
  const [etiqueta, setEtiqueta] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [seleccion, setSeleccion] = useState(NOTAS[0].id);

  const etiquetas = useMemo(
    () => [...new Set(NOTAS.flatMap((n) => n.etiquetas))].sort(),
    []
  );

  const visibles = NOTAS.filter((n) => {
    const q = busqueda.trim().toLowerCase();
    return (
      (cuaderno === "todos" || n.cuaderno === cuaderno) &&
      (!etiqueta || n.etiquetas.includes(etiqueta)) &&
      (!q ||
        n.titulo.toLowerCase().includes(q) ||
        n.contenido.toLowerCase().includes(q))
    );
  });

  const nota = NOTAS.find((n) => n.id === seleccion);
  const nombreCuaderno = (id) => CUADERNOS.find((c) => c.id === id)?.nombre;

  return (
    <div className="app">
      <header className="top">
        <Wordmark />
        <nav aria-label="Principal">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={vista === item.id ? "nav-btn activo" : "nav-btn"}
              onClick={() => setVista(item.id)}
            >
              {item.texto}
            </button>
          ))}
        </nav>
        <span className="usuario">Estudiante</span>
      </header>

      <main>
        {vista === "notas" && (
          <>
            <section className="hero">
              <h1>Todos tus apuntes en un solo lugar.</h1>
              <label className="buscador">
                <span className="sr">Buscar apuntes</span>
                <input
                  type="search"
                  placeholder="Buscar por título o contenido"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </label>
            </section>

            <div className="tablero">
              <aside className="cuadernos" aria-label="Cuadernos">
                <h2>Cuadernos</h2>
                <button
                  className={cuaderno === "todos" ? "cuaderno activo" : "cuaderno"}
                  onClick={() => setCuaderno("todos")}
                >
                  Todas las materias
                </button>
                {CUADERNOS.map((c) => (
                  <button
                    key={c.id}
                    className={cuaderno === c.id ? "cuaderno activo" : "cuaderno"}
                    onClick={() => setCuaderno(c.id)}
                  >
                    {c.nombre}
                  </button>
                ))}
                <button className="nuevo">+ Nuevo cuaderno</button>
              </aside>

              <section className="lista" aria-label="Notas">
                <div className="lista-cab">
                  <h2>Notas ({visibles.length})</h2>
                  <button className="nuevo">+ Nueva nota</button>
                </div>
                {etiqueta && (
                  <button className="filtro" onClick={() => setEtiqueta(null)}>
                    Etiqueta: {etiqueta} ✕
                  </button>
                )}
                {visibles.length === 0 && (
                  <p className="vacio">
                    No hay notas con ese filtro. Prueba con otra búsqueda o crea una nota nueva.
                  </p>
                )}
                {visibles.map((n) => (
                  <button
                    key={n.id}
                    className={seleccion === n.id ? "item activo" : "item"}
                    onClick={() => setSeleccion(n.id)}
                  >
                    <strong>{n.titulo}</strong>
                    <span>
                      {nombreCuaderno(n.cuaderno)} · {n.fecha}
                    </span>
                  </button>
                ))}
              </section>

              <article className="detalle" aria-label="Detalle de la nota">
                {nota ? (
                  <>
                    <p className="meta">
                      {nombreCuaderno(nota.cuaderno)} · {nota.fecha}
                    </p>
                    <h2>{nota.titulo}</h2>
                    <p className="texto">{nota.contenido}</p>
                    <div className="tags">
                      {nota.etiquetas.map((t) => (
                        <button
                          key={t}
                          className="tag"
                          onClick={() => {
                            setEtiqueta(t);
                            setVista("notas");
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="acciones">
                      <button className="primario">Editar</button>
                      <button className="secundario">Adjuntar archivo</button>
                    </div>
                  </>
                ) : (
                  <p className="vacio">Selecciona una nota para leerla.</p>
                )}
              </article>
            </div>
          </>
        )}

        {vista === "etiquetas" && (
          <section className="panel">
            <h1>Etiquetas</h1>
            <p>Toca una etiqueta para ver las notas que la usan.</p>
            <div className="tags">
              {etiquetas.map((t) => (
                <button
                  key={t}
                  className="tag"
                  onClick={() => {
                    setEtiqueta(t);
                    setCuaderno("todos");
                    setVista("notas");
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>
        )}

        {vista === "archivos" && (
          <section className="panel">
            <h1>Archivos</h1>
            <p>Fotos y documentos adjuntos a tus apuntes.</p>
            <ul className="archivos">
              {ARCHIVOS.map((a) => (
                <li key={a.nombre}>
                  <strong>{a.nombre}</strong>
                  <span>{a.cuaderno}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {vista === "config" && (
          <section className="panel">
            <h1>Configuración</h1>
            <p>Las opciones de cuenta y apariencia estarán disponibles en próximas etapas.</p>
          </section>
        )}
      </main>

      <footer>Memento · Proyecto de Taller de Programación</footer>
    </div>
  );
}
