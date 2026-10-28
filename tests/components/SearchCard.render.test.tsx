import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import { useState } from 'react';

import SearchCard from '../../app/components/SearchCard';
import PlaceholderImg from '../../app/resources/img/placeholder.png';

function Test() {
  const [favs, setFavs] = useState([] as string[]);
  const [activeTags, setActiveTags] = useState([] as string[]);

  function toggleFav(key: string) {
    if (favs.includes(key)) {
      setFavs(favs.filter((k: string) => k !== key));
    } else {
      setFavs([...favs, key]);
    }
  }

  function toggleTag(tag: string) {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t: string) => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  }

  return (
    <>
      <SearchCard
        img={PlaceholderImg}
        title="Card Title"
        tags={['Tag 1', 'Tag 2']}
        href=""
        favs={favs}
        toggleFav={toggleFav}
        activeTags={activeTags}
        toggleTag={toggleTag}
      />
      <p id="favs">{favs.join(',')}</p>
      <p id="activeTags">{activeTags.join(',')}</p>
    </>
  );
};

describe('Test component: <SearchCard />', async () => {
  test('Ensure favoriting and unfavoriting the card works', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('a button[aria-label="Add to favorites"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#favs')).toHaveTextContent('Card Title');
    await expect(screen.baseElement.querySelector('a button[aria-label="Remove from favorites"]')).toBeInTheDocument();

    await (screen.baseElement.querySelector('a button[aria-label="Remove from favorites"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#favs')).toHaveTextContent('');
    await expect(screen.baseElement.querySelector('a button[aria-label="Add to favorites"]')).toBeInTheDocument();
  });

  test('Ensure toggling tags works', async () => {
    const screen = await render(<Test />);

    await (screen.baseElement.querySelector('button[aria-label="Toggle \\"Tag 1\\" tag filter"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#activeTags')).toHaveTextContent('Tag 1');

    await (screen.baseElement.querySelector('button[aria-label="Toggle \\"Tag 2\\" tag filter"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#activeTags')).toHaveTextContent('Tag 1,Tag 2');

    await (screen.baseElement.querySelector('button[aria-label="Toggle \\"Tag 1\\" tag filter"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#activeTags')).toHaveTextContent('Tag 2');

    await (screen.baseElement.querySelector('button[aria-label="Toggle \\"Tag 2\\" tag filter"]') as HTMLButtonElement | null)?.click();
    await expect(screen.baseElement.querySelector('#activeTags')).toHaveTextContent('');
  });
});
