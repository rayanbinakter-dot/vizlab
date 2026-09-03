import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { CLASSES } from './data/curriculum.js';
import { useStore, useT } from './store/useStore.js';
import Sidebar from './components/Sidebar.jsx';
import Search from './components/Search.jsx';
import Home from './pages/Home.jsx';
import Viewer from './pages/Viewer.jsx';

export default function App() {
  const t = useT();
  const { classId, setClass, lang, toggleLang } = useStore();
  const [menu, setMenu] = useState(false);

  return (
    <div className="app">
      <header className="topbar">
        <button className="pill mobile-only" onClick={() => setMenu((m) => !m)}>☰</button>
        <Link to="/" className="brand">
          <span className="brand-mark">◈</span> VizLab
        </Link>
        <div className="spacer" />
        <Search />
        <div className="seg">
          {CLASSES.map((c) => (
            <button key={c.id}
              className={`pill ${classId === c.id ? 'active' : ''}`}
              onClick={() => setClass(c.id)}>
              {c.id.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="pill" onClick={toggleLang}>
          {lang === 'en' ? 'বাংলা' : 'EN'}
        </button>
      </header>

      <div className="body">
        <Sidebar open={menu} onNavigate={() => setMenu(false)} />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/:classId/:subjectId/:chapterId/:topicId" element={<Viewer />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
