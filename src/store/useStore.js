import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      lang: 'en',
      classId: 'ssc',
      visited: {},          // "classId/subjectId/chapterId/topicId": true

      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === 'en' ? 'bn' : 'en' }),
      setClass: (classId) => set({ classId }),
      markVisited: (key) => set({ visited: { ...get().visited, [key]: true } }),
    }),
    { name: 'vizlab-prefs' }
  )
);

/** Pick the right language string from a {en, bn} object. */
export function useT() {
  const lang = useStore((s) => s.lang);
  return (obj) => (typeof obj === 'string' ? obj : obj?.[lang] ?? obj?.en ?? '');
}
