import { render } from 'vitest-browser-react';
import { expect, test, describe } from 'vitest';

import SearchProvider from '../../app/components/SearchProvider';
import PlaceholderImg from '../../app/resources/img/placeholder.png';

function Test() {
  return (
    <SearchProvider
      cards={
        [
          {
            img: PlaceholderImg,
            title: 'Card 1',
            tags: [
              'Tag 1',
              'Tag 2',
            ],
            href: '',
          },
          {
            img: PlaceholderImg,
            title: 'Card 2',
            tags: [
              'Tag 2',
              'Tag 3',
            ],
            href: '',
          },
        ]
      }
    />
  );
};

describe('Test component: <SearchProvider />', async () => {
  test('Ensure search form is rendered', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelector('form[role="search"] input[type="search"]')).toBeInTheDocument();
  });

  test('Ensure search cards are rendered as expected', async () => {
    const screen = await render(<Test />);

    await expect(screen.baseElement.querySelectorAll('a > img + div + div')).toHaveLength(2);
  });
});
