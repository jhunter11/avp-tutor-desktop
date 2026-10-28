import { render } from 'vitest-browser-react';
import { useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import AIPane from '../../../app/components/panes/AIPane';
import { type TutorContext } from '../../../app/tutor/client';
import { captureScreenshots } from '../../../app/tutor/capture';

vi.mock('../../../app/tutor/capture', () => ({
  captureScreenshots: vi.fn(async () => [{ label: 'Visualization', data_url: 'data:image/png;base64,synthetic' }]),
}));

const context: Omit<TutorContext, 'screenshots'> = {
  algorithm: 'Search', student_code: 'my unfinished algorithm', executed_code: 'my unfinished algorithm',
  viewed_state: { step: 1, total_steps: 4, highlighted_lines: 2,
    variables: { i: [0, 1] }, last_step: { line: 2, actions: [] }, code_matches_execution: true },
};

afterEach(() => vi.restoreAllMocks());

test('shows loading and suggestions without changing student code', async () => {
  let finish!: (response: Response) => void;
  const fetcher = vi.spyOn(window, 'fetch').mockImplementation(() => new Promise((resolve) => {
    finish = resolve;
  }));
  const screen = await render(
    <>
      <pre data-testid="student-code">{context.student_code}</pre>
      <AIPane context={context} />
    </>,
  );
  await userEvent.fill(screen.baseElement.querySelector<HTMLElement>('textarea')!, 'Why does it stop?');
  await userEvent.click(screen.baseElement.querySelector<HTMLElement>('button[type="submit"]')!);
  await expect.element(screen.baseElement.querySelector<HTMLElement>('[role="status"]')).toHaveTextContent('Tutor is thinking');
  await expect.poll(() => fetcher.mock.calls.length).toBe(1);
  const sent = JSON.parse(fetcher.mock.calls[0][1]!.body as string);
  expect(sent.context.student_code).toBe(context.student_code);
  expect(sent.context.viewed_state.variables).toEqual({ i: [0, 1] });
  expect(sent.context.screenshots).toHaveLength(1);
  finish(new Response(JSON.stringify({ schema_version: '1', request_id: sent.request_id,
    answer: 'Consider what happens after the first comparison.', error: null })));
  await expect.element(screen.baseElement.querySelector<HTMLElement>('[role="log"]')).toHaveTextContent('Consider what happens');
  await expect.element(screen.baseElement.querySelector<HTMLElement>('[data-testid="student-code"]')).toHaveTextContent(context.student_code);
  await expect.element(screen.baseElement.querySelector<HTMLElement>('textarea')).toBeEnabled();
  expect(screen.baseElement.querySelector<HTMLElement>('[role="status"]')).toBeNull();
});

test('error restores controls and preserves the question for retry', async () => {
  vi.spyOn(window, 'fetch').mockRejectedValue(new Error('network unavailable'));
  const screen = await render(<AIPane context={context} />);
  await userEvent.fill(screen.baseElement.querySelector<HTMLElement>('textarea')!, 'Help with my loop');
  await userEvent.click(screen.baseElement.querySelector<HTMLElement>('button[type="submit"]')!);
  await expect.element(screen.baseElement.querySelector<HTMLElement>('[role="alert"]')).toHaveTextContent('network unavailable');
  await expect.element(screen.baseElement.querySelector<HTMLElement>('textarea')).toHaveValue('Help with my loop');
  await expect.element(screen.baseElement.querySelector<HTMLElement>('button[type="submit"]')).toBeEnabled();
});

test('follow-ups send edited code, preserve the executed source, and label earlier views', async () => {
  const fetcher = vi.spyOn(window, 'fetch').mockImplementation(async (_, init) => {
    const sent = JSON.parse(init!.body as string);
    return new Response(JSON.stringify({ schema_version: '1', request_id: sent.request_id,
      answer: 'Consider the stopping condition.', error: null }));
  });
  function Harness() {
    const [edited, setEdited] = useState(false);
    const current = edited ?
      { ...context, student_code: 'my own change',
        viewed_state: { ...context.viewed_state, code_matches_execution: false } } :
      context;
    return (
      <>
        <button onClick={() => setEdited(true)}>Edit my code</button>
        <AIPane context={current} />
      </>
    );
  }
  const screen = await render(<Harness />);
  await userEvent.fill(screen.baseElement.querySelector('textarea')!, 'First question');
  await userEvent.click(screen.baseElement.querySelector('button[type="submit"]')!);
  await expect.element(screen.baseElement.querySelector<HTMLElement>('[role="log"]')).toHaveTextContent('Consider the stopping condition.');
  await userEvent.click(screen.getByRole('button', { name: 'Edit my code' }));
  await expect.element(screen.baseElement.querySelector<HTMLElement>('[role="log"]')).toHaveTextContent('earlier view');
  await userEvent.fill(screen.baseElement.querySelector('textarea')!, 'Explain my change');
  await userEvent.selectOptions(screen.baseElement.querySelector('select')!, 'explain');
  await userEvent.click(screen.baseElement.querySelector('button[type="submit"]')!);
  await expect.poll(() => fetcher.mock.calls.length).toBe(2);
  const sent = JSON.parse(fetcher.mock.calls[1][1]!.body as string);
  expect(sent.mode).toBe('explain');
  expect(sent.context.student_code).toBe('my own change');
  expect(sent.context.executed_code).toBe(context.executed_code);
  expect(sent.context.viewed_state.code_matches_execution).toBe(false);
  expect(sent.history.map((turn: { role: string }) => turn.role)).toEqual(['user', 'assistant']);
});

test('a changed view during screenshot capture sends no mismatched API request', async () => {
  let finish!: (images: { label: string, data_url: string }[]) => void;
  vi.mocked(captureScreenshots).mockImplementationOnce(() => new Promise((resolve) => {
    finish = resolve;
  }));
  const fetcher = vi.spyOn(window, 'fetch');
  function Harness() {
    const [step, setStep] = useState(1);
    return (
      <>
        <button onClick={() => setStep(2)}>Next viewed step</button>
        <AIPane context={{ ...context, viewed_state: { ...context.viewed_state, step } }} />
      </>
    );
  }
  const screen = await render(<Harness />);
  await userEvent.fill(screen.baseElement.querySelector('textarea')!, 'Why?');
  await userEvent.click(screen.baseElement.querySelector('button[type="submit"]')!);
  await userEvent.click(screen.getByRole('button', { name: 'Next viewed step' }));
  finish([{ label: 'View', data_url: 'data:image/png;base64,synthetic' }]);
  await expect.poll(() => screen.baseElement.querySelector('[role="alert"]')?.textContent).toContain('changed during capture');
  expect(fetcher).not.toHaveBeenCalled();
});
