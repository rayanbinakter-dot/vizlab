import { useT } from '../store/useStore.js';

export default function Controls({ controls, params, onChange }) {
  const t = useT();
  if (!controls?.length) return null;

  return (
    <div>
      {controls.map((c) => {
        const val = params[c.id];

        if (c.type === 'toggle') {
          return (
            <div className="ctrl" key={c.id}>
              <label className="switch">
                <input type="checkbox" checked={!!val}
                       onChange={(e) => onChange(c.id, e.target.checked)} />
                {t(c.label)}
              </label>
            </div>
          );
        }

        if (c.type === 'select') {
          return (
            <div className="ctrl" key={c.id}>
              <label><span>{t(c.label)}</span></label>
              <select value={val} onChange={(e) => onChange(c.id, e.target.value)}>
                {c.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          );
        }

        return (
          <div className="ctrl" key={c.id}>
            <label>
              <span>{t(c.label)}</span>
              <b>{typeof val === 'number' ? val.toFixed(2).replace(/\.00$/, '') : val}{c.unit ?? ''}</b>
            </label>
            <input type="range" min={c.min} max={c.max} step={c.step} value={val}
                   onChange={(e) => onChange(c.id, parseFloat(e.target.value))} />
          </div>
        );
      })}
    </div>
  );
}
