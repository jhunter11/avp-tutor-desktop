import Globals from '../globals';

export type TutorTurn = { role: 'user' | 'assistant', content: string };
export type TutorScreenshot = { label: string, data_url: string };
export type TutorContext = {
  algorithm: string
  student_code: string
  executed_code: string
  viewed_state: {
    step: number
    total_steps: number
    highlighted_lines: number | [number, number] | null
    variables: Record<string, unknown>
    last_step: Record<string, unknown>
    code_matches_execution: boolean
  }
  screenshots: TutorScreenshot[]
};
export type TutorRequest = {
  schema_version: '1'
  request_id: string
  question: string
  mode: 'hint' | 'explain'
  history: TutorTurn[]
  context: TutorContext
};

/** Apply the same timeout to capture work that cannot itself accept a signal. */
export function abortable<T>(work: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const stop = () => reject(new Error('The request was stopped.'));
    if (signal.aborted) {
      stop();
      return;
    }
    signal.addEventListener('abort', stop, { once: true });
    work.then((value) => {
      signal.removeEventListener('abort', stop);
      resolve(value);
    }, (error) => {
      signal.removeEventListener('abort', stop);
      reject(error);
    });
  });
}

export async function askTutor(
  request: TutorRequest,
  signal?: AbortSignal,
  transport: typeof fetch = fetch,
): Promise<string> {
  const response = await transport(`${Globals.RouteBaseName}api/tutor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Tutor-Client': 'web-v1' },
    body: JSON.stringify(request),
    signal,
  });
  const body = await response.json();
  if (!body || Object.keys(body).sort().join(',') !== 'answer,error,request_id,schema_version' ||
    body.schema_version !== '1' || body.request_id !== request.request_id) {
    throw new Error('The tutor returned an incompatible reply. Please retry.');
  }
  if (!response.ok || body.error !== null) {
    throw new Error(body.error?.message || 'The tutor could not respond. Please retry.');
  }
  if (typeof body.answer !== 'string' || !body.answer.trim()) {
    throw new Error('The tutor returned no text. Please retry.');
  }
  return body.answer;
}
