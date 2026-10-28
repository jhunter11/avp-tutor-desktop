import { expect, test, describe } from 'vitest';

import Globals from '../../app/globals';
import PageMeta from '../../app/components/PageMeta';

describe('Test component: <PageMeta />', async () => {
  test('Ensure title renders properly', async () => {
    const meta = PageMeta({
      title: 'Test Title',
      description: 'Test Description',
    });

    let titleFound = false;
    let ogTitleFound = false;

    for (const child of meta.props.children) {
      if (child.type === 'title') {
        await expect(child.props.children).toBe(`${Globals.AppName} | Test Title`);
        titleFound = true;
      }
      if (child.type === 'meta' && child.props.property === 'og:title') {
        await expect(child.props.content).toBe(`${Globals.AppName} | Test Title`);
        ogTitleFound = true;
      }
    }

    await expect(titleFound).toBe(true);
    await expect(ogTitleFound).toBe(true);
  });

  test('Ensure description renders properly', async () => {
    const meta = PageMeta({
      title: 'Test Title',
      description: 'Test Description',
    });

    let descriptionFound = false;
    let ogDescriptionFound = false;

    for (const child of meta.props.children) {
      if (child.type === 'meta' && child.props.name === 'description') {
        await expect(child.props.content).toBe('Test Description');
        descriptionFound = true;
      }
      if (child.type === 'meta' && child.props.property === 'og:description') {
        await expect(child.props.content).toBe('Test Description');
        ogDescriptionFound = true;
      }
    }

    await expect(descriptionFound).toBe(true);
    await expect(ogDescriptionFound).toBe(true);
  });
});
