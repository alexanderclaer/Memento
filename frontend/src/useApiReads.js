import { useEffect, useRef, useState } from "react";
import { readJson, routes } from "./api.js";

export function useApiRead(path, list = true) {
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    readJson(path, { signal: controller.signal, list }).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ path, attempt, data });
      },
      (error) => {
        if (!controller.signal.aborted) setResult({ path, attempt, error: error.message });
      },
    );
    return () => controller.abort();
  }, [path, list, attempt]);

  if (!path) return {};
  const current = result?.path === path && result.attempt === attempt ? result : null;
  return {
    data: result?.path === path ? result.data : undefined, error: current?.error, loading: !current,
    retry: () => setAttempt((value) => value + 1),
    update: (mutate) => setResult((previous) => previous?.path === path && previous.attempt === attempt
      ? { ...previous, data: mutate(previous.data) }
      : previous),
  };
}

export function useTopicLists(workspaceId) {
  const [results, setResults] = useState({});
  const requests = useRef(new Map());
  useEffect(() => {
    const pending = requests.current;
    return () => {
      pending.forEach((controller) => controller.abort());
      pending.clear();
    };
  }, [workspaceId]);

  function load(bookId, refresh = false) {
    const pending = requests.current.get(bookId);
    if (pending && !refresh) return;
    pending?.abort();
    const controller = new AbortController();
    requests.current.set(bookId, controller);
    setResults((current) => ({ ...current, [bookId]: { loading: true } }));

    function finish(result) {
      if (controller.signal.aborted) return;
      requests.current.delete(bookId);
      setResults((current) => ({ ...current, [bookId]: result }));
    }

    readJson(routes.topics(bookId), { signal: controller.signal, list: true }).then(
      (data) => finish({ data }),
      (error) => finish({ error: error.message, retry: () => load(bookId) }),
    );
  }

  function update(bookId, mutate) {
    setResults((current) => {
      const previous = current[bookId];
      if (!previous?.data) return current;
      return { ...current, [bookId]: { data: mutate(previous.data) } };
    });
  }

  return { results, load, update };
}
