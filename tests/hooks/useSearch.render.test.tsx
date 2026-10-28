import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import useSearch from '../../app/hooks/useSearch';

function Test() {
  const [
    favs,
    activeTags,
    sort,
    search,
    setFavs,
    setActiveTags,
    setSort,
    setSearch,
  ] = useSearch();

  return (
    <>
      <p id="favs">{JSON.stringify((favs || []))}</p>
      <p id="activeTags">{JSON.stringify((activeTags || []))}</p>
      <p id="sort">{((sort === null) ? 'favorites' : sort)}</p>
      <p id="search">{(search || '')}</p>

      <button onClick={() => setFavs(['hello'])}>Set Favs</button>
      <button onClick={() => setFavs([])}>Clear Favs</button>

      <button onClick={() => setActiveTags(['hello'])}>Set Active Tags</button>
      <button onClick={() => setActiveTags([])}>Clear Active Tags</button>

      <button onClick={() => setSort('hello')}>Set Sort</button>
      <button onClick={() => setSort('')}>Clear Sort</button>

      <button onClick={() => setSearch('hello')}>Set Search</button>
      <button onClick={() => setSearch('')}>Clear Search</button>
    </>
  );
};

describe('Test hook: useSearch()', async () => {
  test('Check default favs value', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#favs')?.innerHTML).toBe('[]');
  });

  test('Check default activeTags value', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#activeTags')?.innerHTML).toBe('[]');
  });

  test('Check default sort value', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#sort')?.innerHTML).toBe('favorites');
  });

  test('Check default search value', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('#search')?.innerHTML).toBe('');
  });

  test('Set favs', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Favs').click();
    await expect(screen.baseElement.querySelector('#favs')?.innerHTML).toBe('["hello"]');
  });

  test('Set activeTags', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Active Tags').click();
    await expect(screen.baseElement.querySelector('#activeTags')?.innerHTML).toBe('["hello"]');
  });

  test('Set sort', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Sort').click();
    await expect(screen.baseElement.querySelector('#sort')?.innerHTML).toBe('hello');
  });

  test('Set search', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Set Search').click();
    await expect(screen.baseElement.querySelector('#search')?.innerHTML).toBe('hello');
  });

  test('Clear favs', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Clear Favs').click();
    await expect(screen.baseElement.querySelector('#favs')?.innerHTML).toBe('[]');
  });

  test('Clear activeTags', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Clear Active Tags').click();
    await expect(screen.baseElement.querySelector('#activeTags')?.innerHTML).toBe('[]');
  });

  test('Clear sort', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Clear Sort').click();
    await expect(screen.baseElement.querySelector('#sort')?.innerHTML).toBe('');
  });

  test('Clear search', async () => {
    const screen = await render(<Test />);

    await screen.getByText('Clear Search').click();
    await expect(screen.baseElement.querySelector('#search')?.innerHTML).toBe('');
  });
});
