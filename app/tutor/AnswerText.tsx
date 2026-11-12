/** Render fenced examples as inert code. No HTML evaluation or editor action. */
export default function AnswerText({ text }: { text: string }) {
  const parts = text.split(/```[\w-]*\r?\n([\s\S]*?)```/g);
  return (
    <div className="tutor-answer">
      {parts.map((part, index) => index % 2 ?
        <pre key={index}><code>{part}</code></pre> :
        <span key={index}>{part}</span>)}
    </div>
  );
}
