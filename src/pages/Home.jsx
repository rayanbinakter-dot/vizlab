import { Link } from 'react-router-dom';
import { CURRICULUM, SUBJECTS, stats } from '../data/curriculum.js';
import { useStore, useT } from '../store/useStore.js';

export default function Home() {
  const t = useT();
  const classId = useStore((s) => s.classId);
  const { total, built } = stats();
  const subjects = CURRICULUM[classId] ?? {};

  return (
    <div>
      <section className="hero">
        <h1>Learn science,<br />by seeing it.</h1>
        <p>
          Interactive 3D visualizations mapped chapter-by-chapter to the NCTB
          syllabus. Pick your chapter, drag the model, move a slider — and watch
          the idea behave.
        </p>
        <div className="stat-row">
          <div className="stat"><b>{built}</b><span>Live models</span></div>
          <div className="stat"><b>{total}</b><span>Topics mapped</span></div>
          <div className="stat"><b>4</b><span>Subjects</span></div>
          <div className="stat"><b>EN / বাং</b><span>Bilingual</span></div>
        </div>
      </section>

      {Object.entries(subjects).map(([subId, chapters]) => {
        const sub = SUBJECTS[subId];
        return (
          <div key={subId}>
            <div className="section-title" style={{ color: sub.color }}>
              {sub.icon} {t(sub.name)}
            </div>
            <div className="grid">
              {chapters.flatMap((ch) =>
                ch.topics.map((tp) => (
                  <Link key={tp.id} className="card"
                        to={`/learn/${classId}/${subId}/${ch.id}/${tp.id}`}>
                    <span className="card-icon">{sub.icon}</span>
                    <h3>{t(tp.title)}</h3>
                    <p>{t(tp.concept)}</p>
                    <div className="tagrow">
                      <span className="tag">Ch {ch.number} · {t(ch.title)}</span>
                      <span className="tag" style={tp.model
                        ? { color: '#22c55e', borderColor: '#14532d' }
                        : undefined}>
                        {tp.model ? '● interactive' : '○ coming soon'}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
