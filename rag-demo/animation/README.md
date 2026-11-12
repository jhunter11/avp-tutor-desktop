# AVP RAG Manim walkthrough

The 134-second video follows a real AVP syntax query through corpus selection, MiniLM encoding, cosine ranking and source extraction. It also shows a real failure: a while-loop question retrieves for-loop passages. The video uses saved output, not live inference. It has captions and a presenter script; it has no recorded voice track.

Open **Walkthrough** in the local demo's right pane, or play `public/media/avp-rag-walkthrough.mp4`. Read [DIRECTOR_SCRIPT.md](DIRECTOR_SCRIPT.md) for scene directions and narration. `storyboard.json` controls timing and narration; `avp_rag.py` draws the animation.

## Rebuild

The existing machine has Cairo, Pango and FFmpeg. Keep Manim in a separate environment so its NumPy version does not change the embedding runtime:

```sh
.venv/bin/python -m venv .venv-manim
.venv-manim/bin/python -m pip install -r animation/requirements.txt
```

Use Node 22 for the checks below. Run the standard corpus tests if sources changed, then export and render:

```sh
npm run evaluate:challenge
npm run animation:export
npm run animation:render
.venv/bin/python tools/publish-animation.py
```

If a source or vector index changes, re-export before rendering. The exporter and scene reject stale source hashes, fabricated scores, mismatched code, hidden solution passages, ineligible quotes and caption timing gaps. The publisher checks the H.264 format and duration before copying the local video.

The render is 1920×1080 at 30 frames per second. Manim writes intermediate clips under the ignored `artifacts/manim-v2/` directory. `public/media/` holds the final video and poster and is included in the desktop GitHub copy. The small snapshot, script and caption track remain inspectable source artifacts. Playing the saved video does not require Manim.

Nine representative rendered frames appear in `artifacts/animation-style-contact.png`. A visual check of those frames is separate from the retrieval tests. The video does not establish answer quality, correctness for all AVP programs, or student learning.

The presentation uses eight flat chapters and one genuine 3D chapter. Read `DESIGN.md` for font choices and camera direction. Run `npm run animation:preview` for a smaller render; `npm run animation:check` checks measured text and camera records after rendering. The full render uses separate clips for each chapter, then combines them in script order.

In the demo, use **Watch walkthrough** to enter the video and **Back to live sources** to leave it. Leaving pauses playback without resetting its position. Chat and retrieval results remain available throughout.
