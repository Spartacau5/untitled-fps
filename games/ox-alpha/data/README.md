# Data pack — real MoE router profile

Two files, both loaded by the app at runtime from `data/`.

## `routing.json` — aggregate router profile (REAL)

Captured on a 4x RTX 3090 rig: **Laguna S 2.1 (117B MoE) INT4 W4A16** served by
vLLM at TP=4 in prefill, router selection intercepted in the FusedMoE sigmoid
path and extracted with `collective_rpc`. **3,205,231 tokens** from 2048 prompts, 1.5B
(token, expert) selections, over a mixed corpus tagged by domain.

```
schema_version : 1
source         : "real-capture"
meta           : model / engine / hardware / method / tokens_profiled / prompts / expert_selections / captured
dims           : { layers: 47, experts: 256, top_k: 10 }
sparse_layers  : int[47]        model layer index of each sparse (MoE) layer
domains        : ["agentic","code","general","reasoning","systems"]
metrics.count        : int[47][256]     times expert e was selected in layer l
metrics.share        : float[47][256]   count normalized within the layer (sums to 1)
metrics.mass_share   : float[47][256]   routing WEIGHT share within the layer (sums to 1)
metrics.reap_norm    : float[47][256]   REAP saliency, normalized to the layer max
metrics.domain_share : { domain: float[47][256] }   per-domain count share within the layer
```

Uniform routing would give every expert `share = 10/256 = 0.0390625`. It does not.

## `token-trace.json` — per-token route through the stack

```
schema_version : 1
source         : "sampled-placeholder" | "real-capture"
meta.warning   : non-empty when the routes are sampled rather than measured
dims           : same as routing.json
tokens[]       : { i, text, experts: int[47][10], weights: float[47][10] }
                 experts[l][j] = expert id of the j-th pick at sparse layer l,
                 weights[l][j] = its normalized routing weight, descending
```

**The file currently shipped is `real-capture`**: 158 tokens from three short
prompts (python code, a vLLM serve command line, Russian prose) pushed through
prefill on the same Laguna S 2.1 INT4 checkpoint at TP=4, top-k ids and
normalized weights recorded per sparse layer, `meta.warning` empty. Tokens also
carry `prompt` (0..2) and `domain`.

The schema also serves a `sampled-placeholder` variant, where routes are drawn
from the real per-layer distribution rather than measured and `meta.warning` is
non-empty. The app must read `source` and `meta.warning` at RUNTIME and label
the screen accordingly — never hardcode the provenance or the token count,
because this file gets replaced between runs.

Regenerate: `python3 ../../prepare-data.py`, `python3 ../../make-trace.py`.
