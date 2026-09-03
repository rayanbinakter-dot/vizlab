import { NavLink, useParams } from 'react-router-dom';
import { SUBJECTS, getChapters } from '../data/curriculum.js';
import { useStore, useT } from '../store/useStore.js';

export default function Sidebar({ open, onNavigate }) {
  const t = useT();
  const classId = useStore((s) => s.classId);
  const { topicId } = useParams();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      {Object.values(SUBJECTS).map((sub) => {
        const chapters = getChapters(classId, sub.id);
        if (!chapters.length) return null;
        return (
          <div className="sb-group" key={sub.id}>
            <div className="sb-subject" style={{ color: sub.color }}>
              <span>{sub.icon}</span>{t(sub.name)}
            </div>
            {chapters.map((ch) => (
              <div key={ch.id}>
                <div className="sb-chapter">
                  {ch.number ? `Ch ${ch.number} · ` : ''}{t(ch.title)}
                </div>
                {ch.topics.map((tp) => (
                  <NavLink
                    key={tp.id}
                    to={`/learn/${classId}/${sub.id}/${ch.id}/${tp.id}`}
                    className={({ isActive }) => `sb-topic ${isActive ? 'active' : ''}`}
                    onClick={onNavigate}
                  >
                    <span className={`dot ${tp.model ? 'ready' : 'soon'}`} />
                    {t(tp.title)}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </aside>
  );
}
