import { test, describe, assertType } from 'vitest';

import { type Step, type VisData } from '../app/types';

describe('Test types', async () => {
  test('Enture Step type is valid', async () => {
    await assertType<Step>(
      {
        line: 1,
        actions: [
          {
            cmd: 'foo',
            params: {
              bar: 'baz',
            },
          },
          {
            cmd: 'foo2',
            params: {
              bar2: 'baz2',
            },
          },
        ],
      },
    );
  });

  test('Enture VisData type is valid', async () => {
    await assertType<VisData>(
      {
        data: [1, 2, 3],
        type: 'abcde',
        logs: ['foo', 'bar'],
        marks: {
          foo: [
            {
              type: 'foo',
              color: 'red',
              value: '2000',
            },
            {
              type: 'bar',
              color: 'blue',
              value: '3000',
            },
          ],
          bar: [
            {
              type: 'foo',
              color: 'red',
              value: '2000',
            },
            {
              type: 'bar',
              color: 'blue',
              value: '3000',
            },
          ],
        },
      },
    );
  });
});
