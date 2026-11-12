# AVP RAG: director and presenter script

134-second silent animation with captions. Read the narration aloud if presenting. All retrieval values come from `public/animation/snapshot.json`.

## 00:00:00.000 – 00:00:10.000: Ask an AVP question

Direction: Keep a flat 2D pipeline. Move the request marker left to right with eased motion; hold the full question for reading.

Narration: A student asks how to visit every element of an AVP array. This example uses a saved run of the real local retriever. The reply quotes sources; no answer model runs.

## 00:00:10.000 – 00:00:22.000: Store passages with their sources

Direction: Reveal source cards, then split the corpus into eligible and excluded records. Lift the actual for-loop source ID from the saved result.

Narration: The index contains 131 vectors. Only 42 passages can enter a student reply. Manual AVP chunks keep code blocks intact, with stable source IDs. Full programs and configuration answers stay outside retrieval.

## 00:00:22.000 – 00:00:34.000: Encode text as numbers

Direction: Keep the encoder and 384-cell heatmap in 2D. Do not tilt the text or suggest that the grid is a map of topics.

Narration: MiniLM converts the question to 384 numbers. Source passages use the same encoder and preprocessing recipe for their stored vectors. These unit vectors describe similarity; their components do not name concepts.

## 00:00:34.000 – 00:00:54.000: An exact three-vector view

Direction: Use 3D axes and genuine perspective for the exact selected span. Orbit 18 degrees over eight seconds, then hold. Keep the legend fixed to the screen and vector labels facing the camera. Ease the orbit to zero speed at both ends; cap angular speed at 4.5 degrees per second.

Narration: These three selected vectors span at most three dimensions. An orthonormal change of coordinates preserves their lengths and pairwise angles. The camera moves around that real three-dimensional span, then stops. Search still uses all 384 dimensions.

## 00:00:54.000 – 00:01:10.000: Compare all eligible vectors

Direction: Use flat horizontal cosine bars and a signed component-product graph. Keep the camera still so viewers can compare values and cutoffs.

Narration: For each passage, search multiplies matching vector components and adds all 384 products. That gives cosine similarity for unit vectors. The real ranking places the for-loop passage at position 2.

## 00:01:10.000 – 00:01:28.000: Read the original AVP passage

Direction: Use Menlo for exact AVP code with explicit indentation and panel padding. Ease into a 2D close-up over 1.6 seconds, stop for reading, then return to the full view.

Narration: Retrieval returns the original text attached to the vector. The quoted AVP loop visits zero through length minus one and closes with end for. The interpreter checked this snippet; that does not review all teaching prose.

## 00:01:28.000 – 00:01:46.000: Keep one frontend API

Direction: Keep the diagram in 2D. Follow the request to the right and the response to the left, using 1.6-second planar camera pans. Do not orbit the diagram. Route returned source passages into the backend before showing its text reply to the frontend.

Narration: The old frontend keeps one tutor request with the question and student context, and receives one text answer. The backend sends only the question to this RAG lookup. Code blocks display as examples; they do not change the student's editor.

## 00:01:46.000 – 00:02:00.000: Similarity does not check support

Direction: Keep the unsupported question and source-score graph flat. Use orange for retrieval and red for the unsupported topic. Hold the camera still.

Narration: Ask for while-loop syntax. The current corpus lacks that passage, but similarity still returns for-loop text. This is a recorded limitation. We need coverage checks and answer relevance evaluation before treating every retrieval as useful help.

## 00:02:00.000 – 00:02:14.000: Review, measure, then expand

Direction: Show the measured counts from the saved challenge report, followed by the next work items. End on the local demo URL and the offline status. Do not claim held-out testing or student-learning results.

Narration: The new challenge set found expected sources for 15 of 15 supported questions, but only 12 entered replies. 5 of 9 unsupported questions received no quote. Keep these failures, review new sources, and test live generation separately.

The challenge cases are developer-authored diagnostics, not a held-out benchmark. The animation makes no live answer-model call and proves no learning outcome.
