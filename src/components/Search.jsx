import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allTopics, SUBJECTS } from '../data/curriculum.js';
import { useT } from '../store/useStore.js';

export default function Search() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const box = useRef();
  const nav = useNavigate();
  const t = useT();
  const index = useMemo(() => allTopics(), []);

  useEffect(() => {
    const h = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return [];
    return index.filter(({ topic, chapter }) =>
      [topic.title.en, topic.title.bn, topic.concept?.en, chapter.title.en, chapter.title.bn]
        .filter(Boolean).some((v) => v.toLowerCase().includes(s))
    ).slice(0, 8);
  }, [q, index]);

  return (
    <div className="search" ref={box}>
      <input
        value={q}
        placeholder="Search a concept…  (e.g. orbital, তরঙ্গ, DNA)"
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      {open && hits.length > 0 && (
        <div className="results">
          {hits.map(({ classId, subjectId, chapter, topic }) => (
            <a key={`${classId}/${subjectId}/${chapter.id}/${topic.id}`}
               className="result"
               onClick={() => {
                 nav(`/learn/${classId}/${subjectId}/${chapter.id}/${topic.id}`);
                 setOpen(false); setQ('');
               }}>
              {t(topic.title)}
              <small>
                {classId.toUpperCase()} · {t(SUBJECTS[subjectId].name)} · {t(chapter.title)}
                {topic.model ? '' : ' · coming soon'}
              </small>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
