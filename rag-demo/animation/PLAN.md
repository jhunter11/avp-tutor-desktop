# Accuracy checks and AVP animation

## Problem
The current heatmap shows numbers but does not explain how they select an AVP passage. We also need harder questions before claiming that a larger corpus is the only remaining task. The audience includes the frontend team, professor and client.

## This iteration
Keep the two-pane interface. Add a comparison of the question vector and a selected retrieved passage, with the actual cosine calculation across all 384 dimensions. Mark retrieved passages that the answer does not quote. Create a directed Manim video using saved output from the running retrieval code, including exact AVP syntax, real ranking and an unsupported question. Supply a narration script, captions and reproducible render commands.

## Assumptions and risks
The cached encoder and installed Cairo/Pango libraries can run locally. An isolated Manim environment must not change the tutor environment. A source quote can be exact yet irrelevant; report retrieval misses and inappropriate answers rather than hiding them. A similarity cutoff does not establish factual support. Avoid changing the corpus or cutoff to fit the new questions. Developer-authored questions are not an independent benchmark.

## Approach and alternatives
Use real vector components rather than a decorative two-dimensional map, because projection can change apparent distances. Use a scripted animation rather than a screen recording so each stage has an explicit explanation. Keep production tutor requests fixed; only the separate inspection API gains vector comparison data. Offline source extraction stays visible throughout the video. Show a future model step as a proposal only.

## Work order
1. Save new challenge questions and test citation eligibility and numerical consistency before changing behavior.
2. Run them on the existing system, record failures, and repair demonstrated defects.
3. Add the vector comparison and inspect it in the browser.
4. Export a checked animation snapshot, render the Manim scene, and inspect representative frames.
5. Record tests, remaining failures and source hashes with the current local state.

## Boundaries and team decisions
Prose review, corpus permissions and teaching policy need team review. Contributors can divide source review and independent evaluation later. This iteration does not train weights, activate a paid provider, change team charts or publish code. Live generated answers and human-learning outcomes need separate evidence.

## Later
Add reviewed course material after ingestion and retrieval checks pass. Use independent questions to compare chunking and retrieval methods. Do not treat animation quality as evidence of tutor accuracy.

## Visual revision
Use STIX Two Text, Avenir Next and Menlo at normal widths. Render eight chapters in 2D and one exact selected-vector span in 3D. Add measured text containment and overlap checks, signed score graphs, and camera speed/direction records. The embedded player pauses when leaving and preserves playback position while the chat stays available.
