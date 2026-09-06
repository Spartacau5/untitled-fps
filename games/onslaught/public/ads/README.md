# Your billboards

Drop a PNG or JPG in this folder, then point a campaign at it in
`games/onslaught/src/render/city/ads.js`:

```js
{
  id: "my-ad",
  headline: "FALLBACK TEXT",
  subline: "SHOWN IF THE IMAGE IS MISSING",
  bg: "#123456",
  fg: "#ffffff",
  image: "ads/my-poster.png",   // <- this folder, relative to the site root
  motion: "pulse",
}
```

Landscape artwork around 2:1 fits the large boards best (the drawn boards are
1024x512). The folder ships empty and nothing here is required — if the file
is missing or the path is wrong, the board falls back to the drawn headline.
