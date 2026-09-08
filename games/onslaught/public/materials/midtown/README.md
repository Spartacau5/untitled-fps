# Midtown v6 surface pack

Three CC0 Poly Haven surface sets, bundled with the game so play never depends on a third-party asset host. Maps are 1024 × 1024 JPEGs, with diffuse colour, OpenGL normals and roughness. The files were re-encoded as JPEG at unchanged resolution for delivery. Normal maps use higher quality than colour/roughness maps.

| Local prefix | Source | Author |
| --- | --- | --- |
| asphalt | https://polyhaven.com/a/asphalt_02 | Rob Tuytel |
| brick | https://polyhaven.com/a/brick_wall_001 | Dimitrios Savva, Rob Tuytel |
| concrete | https://polyhaven.com/a/concrete_layers_02 | Rob Tuytel |

License: [CC0](https://polyhaven.com/license). Redistribution and commercial use are permitted. `manifest.json` records the source URL, checksum, size and local destination of every shipped image.

Runtime loads at most three surface families concurrently, with three sequential requests per family. Every family is applied atomically. Network or decode failure retains its baked fallback material. Diffuse maps use sRGB; normals and roughness remain linear data. The loader finishes before shader compilation and the first gameplay frame.

World tiling: asphalt 3 metres, concrete 2 metres, brick 1.1 metres. The brick scale is deliberately adjusted for plausible individual brick dimensions in the current map.

The nine scanned maps occupy about 48 MiB of decoded RGBA GPU texture storage including mipmaps. Download size is a separate quantity recorded in the manifest. Textures are shared across material variants. The Broadway image adds about 8 MiB including mipmaps. No 4K/8K maps are shipped.
