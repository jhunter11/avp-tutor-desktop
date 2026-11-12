import { expect, test } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import AnswerText from '../app/tutor/AnswerText';

test('fenced source examples render as code without an editor action', () => {
  const html = renderToStaticMarkup(<AnswerText text={'Use this syntax.\n```avp\nif (i < n):\nend if\n```'} />);
  expect(html).toContain('<pre><code>');
  expect(html).toContain('i &lt; n');
  expect(html).not.toContain('<button');
});

test('source HTML stays inert in prose and code', () => {
  const html = renderToStaticMarkup(<AnswerText text={'<img src=x onerror=alert(1)>\n```avp\n<script>alert(1)</script>\n```'} />);
  expect(html).not.toContain('<script>');
  expect(html).not.toContain('<img');
  expect(html).toContain('&lt;script&gt;');
});
