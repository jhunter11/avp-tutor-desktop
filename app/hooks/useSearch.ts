import {
  useEffect,
  useState,
} from 'react';

/**
 * Provides a hook to read and edit search state.
 */
export default function useSearch() {
  const [favs, setFavs] = useState(null as string[] | null);
  const [activeTags, setActiveTags] = useState(null as string[] | null);
  const [sort, setSort] = useState(null as string | null);

  const [search, setSearch] = useState(null as string | null);

  useEffect(() => {
    if (favs === null) return;
    localStorage.setItem('favs', JSON.stringify(favs));
  }, [favs]);

  useEffect(() => {
    if (activeTags === null) return;
    localStorage.setItem('activeTags', JSON.stringify(activeTags));
  }, [activeTags]);

  useEffect(() => {
    if (sort === null) return;
    localStorage.setItem('sort', sort);
  }, [sort]);

  useEffect(() => {
    if (search === null) return;
    localStorage.setItem('search', search);
  }, [search]);

  useEffect(() => {
    setFavs(JSON.parse(localStorage.getItem('favs') || '[]'));
    setActiveTags(JSON.parse(localStorage.getItem('activeTags') || '[]'));
    setSort(localStorage.getItem('sort') || 'favorites');
    setSearch(localStorage.getItem('search') || '');
  }, []);

  return [
    favs,
    activeTags,
    sort,
    search,
    setFavs,
    setActiveTags,
    setSort,
    setSearch,
  ] as const;
}
