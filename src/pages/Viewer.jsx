import { Suspense, useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTopic, SUBJECTS } from '../data/curriculum.js';
import { MODELS } from '../models/registry.js';
import { useStore, useT } from '../store/useStore.js';
import Scene from '../components/Scene.jsx';
import Controls from '../components/Controls.jsx';

export default function Viewer() {
  const { classId, subjectId, chapterId, topicId } = useParams();
  const t = useT();
  const markVisited = useStore((s) => s.markVisited);
  // `getTopic()` returns a fresh { chapter, topic } object on every call, so
  // memoize it on the route params. Without this, `found` changed identity on
  // every render, which (a) rebuilt `initial` and re-ran the `setParams` reset
  // effect below, and (b) re-ran the `markVisited` effect (App subscribes to
  // the whole store, so `markVisited` re-renders Viewer) — together an
  // infinite update loop ("Maximum update depth exceeded") that unmounted the
  // whole app to a blank page.
  const found = useMemo(
    () => getTopic(classId, subjectId, chapterId, topicId),
    [classId, subjectId, chapterId, topicId],
  );

  const initial = useMemo(() => {
    const o = {};
    found?.topic.controls?.forEach((c) => (o[c.id] = c.value));
    return o;
  }, [found]);

  const [params, setParams] = useState(initial);
  useEffect(() => setParams(initial), [initial]);
  useEffect(() => {
    if (found) markVisited(`${classId}/${subjectId}/${chapterId}/${topicId}`);
  }, [classId, subjectId, chapterId, topicId, found, markVisited]);

  if (!found) {
    return (
      <div className="empty">
        <h2>Topic not found</h2>
        <p>It may have been renamed. <Link to="/" style={{ color: 'var(--accent)' }}>Back to home</Link></p>
      </div>
    );
  }

  const { chapter, topic } = found;
  const sub = SUBJECTS[subjectId];
  const Model = topic.model ? MODELS[topic.model] : null;

  return (
    <div className="viewer">
      <div className="stage">
        {Model ? (
          <Suspense fallback={<div className="loading">Loading model…</div>}>
            <Scene>
              <Model params={params} />
            </Scene>
          </Suspense>
        ) : (
          <div className="loading">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 34, marginBottom: 10 }}>🚧</div>
              This visualization is on the roadmap.
            </div>
          </div>
        )}
      </div>

      <aside className="panel">
        <div className="crumb" style={{ color: sub.color }}>
          {classId.toUpperCase()} · {t(sub.name)} · Ch {chapter.number} {t(chapter.title)}
        </div>
        <h2>{t(topic.title)}</h2>
        <div className="concept">{t(topic.concept)}</div>
        {topic.formula && <div className="formula">{topic.formula}</div>}
        {topic.notes && (
          <section className="notes-box" aria-label={t(topic.notes.heading)}>
            <h3>{t(topic.notes.heading)}</h3>
            <div className="notes-table">
              <div className="notes-row notes-header">
                {topic.notes.columns.map((column) => (
                  <span key={column.en}>{t(column)}</span>
                ))}
              </div>
              {topic.notes.rows.map((row) => (
                <div className="notes-row" key={row.label.en}>
                  <b>{t(row.label)}</b>
                  {row.cells.map((cell, index) => <span key={`${row.label.en}-${index}`}>{cell}</span>)}
                </div>
              ))}
            </div>
            <p>{t(topic.notes.foot)}</p>
          </section>
        )}

        <Controls
          controls={topic.controls}
          params={params}
          onChange={(id, v) => setParams((p) => ({ ...p, [id]: v }))}
        />

        <div className="hint">
          Drag to orbit · scroll to zoom · right-drag to pan.<br />
          Move one slider at a time and watch what stays constant — that is
          usually the law you are meant to learn.
        </div>
      </aside>
    </div>
  );
}
