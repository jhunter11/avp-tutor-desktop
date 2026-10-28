import { toPng } from 'html-to-image';
import { type TutorScreenshot } from './client';

/** Capture only visualizer context panes, never the desktop or tutor chat. */
export async function captureScreenshots(): Promise<TutorScreenshot[]> {
  const nodes = [...document.querySelectorAll<HTMLElement>('[data-tutor-capture]')];
  if (!nodes.length) throw new Error('The visualization is not ready to capture.');
  return Promise.all(nodes.map(async (node) => {
    const width = node.clientWidth;
    const height = node.clientHeight;
    if (!width || !height) throw new Error('Open the visualization before asking the tutor.');
    const scale = Math.min(1, 1400 / width, 1000 / height);
    const data_url = await toPng(node, {
      pixelRatio: 1, skipFonts: true, cacheBust: true,
      canvasWidth: Math.max(1, Math.round(width * scale)),
      canvasHeight: Math.max(1, Math.round(height * scale)),
    });
    if (data_url.length > 1_500_000) {
      throw new Error('The view is too large to capture. Resize it and retry.');
    }
    return { label: node.dataset.tutorCapture || 'Viewed context', data_url };
  }));
}
