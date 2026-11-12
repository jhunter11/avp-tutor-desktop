# AVP RAG: visual direction

Use a dark mathematical presentation with 3Blue1Brown's public Manim palette as a colour reference: [palette source](https://github.com/3b1b/manim/blob/master/manimlib/constants.py). Keep this project's identity and source evidence visible.

STIX Two Text supplies mathematical headings. Avenir Next supplies labels and explanations; Menlo preserves code indentation. Use normal font widths and wrap text instead of squeezing it. Body explanations use 26–30 Manim points at 1080p; compact flow labels use 24, and source IDs and axis ticks use at least 22. Leave 0.45 units inside panels, 0.6 between sections and a clear lower band for captions.

The question, corpus, encoding, ranking, code, API and evaluation chapters remain flat 2D. Their camera can pan or zoom within that plane; it never tilts or rotates text. Hold the camera while viewers read. The API request moves left to right and the reply moves right to left. A restrained push toward the code precedes the reading hold.

The vector-geometry chapter uses real 3D axes and camera perspective. It expresses three actual 384-dimensional vectors in an orthonormal basis for their exact span, preserving every pairwise dot product. Label this scope on screen. This does not project the full corpus into three dimensions or run search there. Orbit 18 degrees over eight seconds to reveal the third component, then stop for the angle explanation. A cosine velocity profile averages 2.25 degrees per second and peaks at 4.5, with no sudden start or stop. Perspective changes the apparent screen angles; the 3D coordinates preserve the actual angles. HUD text remains fixed to the screen; vector labels face the camera.

Use horizontal score graphs and a signed contribution plot. Bars derive from recorded scores and vector products, with labelled axes and explicit cutoffs. Colour distinguishes the question (blue), the for-loop source (teal), the array source (yellow) and unsupported content (red/orange). Preserve these roles across chapters.

Render each chapter separately at 1920×1080 and 30 fps. Check font availability, panel containment, scene bounds and camera budgets during rendering. Inspect every chapter and the beginning, middle and end of each camera move before combining clips. The current saved RAG results and known accuracy limits stay unchanged.
