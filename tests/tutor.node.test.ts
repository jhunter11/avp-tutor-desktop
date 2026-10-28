import { expect, test, vi } from 'vitest';
import { abortable, askTutor } from '../app/tutor/client';

test('one fixed tutoring API passes context and returns text only', async () => {
  const request = { schema_version: '1', request_id: 'one', question: 'Why?',
    mode: 'hint', history: [], context: { student_code: 'my code',
      executed_code: 'old code', algorithm: 'Search', viewed_state: {},
      screenshots: [{ label: 'View', data_url: 'data:image/png;base64,abc' }] } } as const;
  const transport = vi.fn().mockResolvedValue(new Response(JSON.stringify({
    schema_version: '1', request_id: 'one', answer: 'Look at the condition.', error: null,
  })));
  expect(await askTutor(request as any, undefined, transport)).toBe('Look at the condition.');
  expect(transport.mock.calls[0][0]).toBe('/MiamiOH-AVP-Demo/api/tutor');
  expect(JSON.parse(transport.mock.calls[0][1].body)).toEqual(request);
  expect(transport.mock.calls[0][1].headers).not.toHaveProperty('Authorization');
});

test('rejects the inherited generated-code response and mismatched replies', async () => {
  for (const body of [{ generated_code: 'fixed code' },
    { schema_version: '1', request_id: 'wrong', answer: 'answer', error: null }]) {
    const transport = vi.fn().mockResolvedValue(new Response(JSON.stringify(body)));
    await expect(askTutor({ request_id: 'one' } as any, undefined, transport)).rejects.toThrow();
  }
});

test('a stalled screenshot capture can be stopped by the request timeout', async () => {
  const controller = new AbortController();
  const result = abortable(new Promise<never>(() => {}), controller.signal);
  const assertion = expect(result).rejects.toThrow('stopped');
  controller.abort();
  await assertion;
});
