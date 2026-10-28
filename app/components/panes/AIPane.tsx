import { useEffect, useRef, useState, type FormEvent } from 'react';
import { abortable, askTutor, type TutorContext, type TutorTurn } from '../../tutor/client';
import { captureScreenshots } from '../../tutor/capture';
import '../../tutor/tutor.css';

type Message = TutorTurn & { step: number, snapshot: string };

/** Text-only tutoring. Intentionally has no editor setter or code action. */
export default function AIPane({ context }: {
  context: Omit<TutorContext, 'screenshots'>
}) {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<'hint' | 'explain'>('hint');
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const latest = useRef(context);
  latest.current = context;
  const busy = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const log = useRef<HTMLDivElement | null>(null);
  const snapshot = JSON.stringify(context);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    log.current?.scrollTo(0, log.current.scrollHeight);
  }, [messages, pending]);

  async function send(event: FormEvent) {
    event.preventDefault();
    if (busy.current || !question.trim()) return;
    busy.current = true;
    setPending(true);
    setError('');
    const captured = JSON.stringify(latest.current);
    const capturedContext = JSON.parse(captured) as Omit<TutorContext, 'screenshots'>;
    const submittedQuestion = question.trim();
    const abort = new AbortController();
    controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 135000);
    try {
      const screenshots = await abortable(captureScreenshots(), abort.signal);
      if (JSON.stringify(latest.current) !== captured) {
        throw new Error('The code or viewed step changed during capture. Stop the animation and retry.');
      }
      if (abort.signal.aborted) throw new Error('The tutor request timed out. Please retry.');
      const history = messages.slice(-12)
        .map(({ role, content }) => ({ role, content }));
      while (history.reduce((n, m) => n + m.content.length, 0) > 24000) {
        history.shift();
      }
      const answer = await askTutor({
        schema_version: '1', request_id: crypto.randomUUID(),
        question: submittedQuestion, mode, history,
        context: { ...capturedContext, screenshots },
      }, abort.signal);
      setMessages(previous => [...previous,
        { role: 'user', content: submittedQuestion, step: capturedContext.viewed_state.step, snapshot: captured },
        { role: 'assistant', content: answer, step: capturedContext.viewed_state.step, snapshot: captured },
      ]);
      setQuestion('');
    } catch (cause) {
      setError(abort.signal.aborted ?
        'The tutor request was stopped or timed out. Please retry.' :
        cause instanceof Error ? cause.message : 'The tutor could not respond. Please retry.');
    } finally {
      window.clearTimeout(timeout);
      busy.current = false;
      setPending(false);
      controller.current = null;
    }
  }

  return (
    <section className="tutor-pane" aria-label="Algorithm tutor">
      <div className="tutor-intro">
        <span>Hints to help you build your own solution.</span>
        {!!messages.length && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setMessages([]);
              setError('');
            }}
          >
            New chat
          </button>
        )}
      </div>
      <div className="tutor-messages" role="log" aria-label="Tutor conversation" aria-live="polite" ref={log}>
        {!messages.length && <p className="tutor-empty">Ask about a step, a variable, or where you are stuck. Your code stays yours.</p>}
        {messages.map((message, i) => (
          <article className={`tutor-message tutor-${message.role}`} key={i}>
            <strong>{message.role === 'user' ? 'You' : 'Tutor'}</strong>
            <span className="tutor-context-label">
              Step
              {message.step}
              {message.snapshot !== snapshot ? ' · earlier view' : ''}
            </span>
            <p>{message.content}</p>
          </article>
        ))}
        {pending && (
          <div className="tutor-pending" role="status">
            <span className="tutor-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Tutor is thinking…</span>
          </div>
        )}
      </div>
      {error && <p className="tutor-error" role="alert">{error}</p>}
      <form onSubmit={send} className="tutor-form">
        <label htmlFor="tutor-question" className="sr-only">Question for the tutor</label>
        <textarea
          id="tutor-question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          disabled={pending}
          maxLength={4000}
          placeholder="What would you like help understanding?"
          rows={2}
        />
        <div className="tutor-actions">
          <label>
            Help mode
            <select
              aria-label="Help mode"
              value={mode}
              disabled={pending}
              onChange={e => setMode(e.target.value as 'hint' | 'explain')}
            >
              <option value="hint">Hint</option>
              <option value="explain">Explain</option>
            </select>
          </label>
          <button type="submit" disabled={pending || !question.trim()}>{pending ? 'Thinking…' : 'Ask tutor'}</button>
        </div>
        <small>
          Sends your code, viewed state, and snapshots of the
          visualization and variables.
        </small>
      </form>
    </section>
  );
}
