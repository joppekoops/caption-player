# Caption Player
A package for displaying captions made with caption-styler on a `<video>` element.

## Installation
```
npm i @caption-styler/caption-player
```

## Usage
To display captions on your video, first create a WebVTT file with the caption-styler.

1. Add the video and captions to your HTML like normal:

```html
<video controls>
    <source src="video.mp4" />
    <track src="captions.vtt" srclang="en" kind="captions" default />
    <!--  More <track>-elements with other languages or styles.  -->
</video>
```

2. Add a `CaptionPlayer` instance in JavaScript:

```js
import { CaptionPlayer } from '@caption-styler/caption-player' // from node_modules folder

const video = document.querySelector('video')

new CaptionPlayer(video)
```

3. Add the caption player stylesheet to your HTML:

```html
<link rel="stylesheet" href="./node_modules/@caption-styler/caption-player/dist/caption-player.css" />
```

or import using vite or webpack:

```js
import '@caption-styler/caption-player.css'
```

The `CaptionPlayer` will add a container around the video and display the captions.
This will also hide the original captions of the video.