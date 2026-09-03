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
  const found = getTopic(classId, subjectId, chapterId, topicId);

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
