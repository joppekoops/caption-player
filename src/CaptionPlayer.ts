import { cueIsVttCue, elementIsTrackElement, getCuePosition, getVttStyles } from './helpers'
import './styles.css'

export class CaptionPlayer {
    private readonly containerElement: HTMLDivElement
    private readonly cueContainerElement: HTMLDivElement
    private readonly cueStyleElement: HTMLStyleElement
    private resizeObserver: ResizeObserver | undefined

    constructor(private readonly videoElement: HTMLVideoElement) {
        this.containerElement = document.createElement('div')
        this.containerElement.className = 'cs-video-container'

        this.cueContainerElement = document.createElement('div')
        this.cueContainerElement.className = 'cs-cue-container'

        this.cueStyleElement = document.createElement('style')

        this.videoElement.replaceWith(this.containerElement)

        this.containerElement.appendChild(this.cueStyleElement)
        this.containerElement.appendChild(this.cueContainerElement)
        this.containerElement.appendChild(this.videoElement)

        this.initPlayer()
    }

    private initPlayer() {
        this.videoElement.onloadedmetadata = () => this.initResize()
        this.initResize()

        this.videoElement.textTracks.onchange = () => this.initCaptions()
        this.initCaptions()

        this.videoElement.onfullscreenchange = () => this.handleFullscreen()
        this.videoElement.classList.add('cues-hidden')
    }

    private async initCaptions() {
        const activeTrackElement = Array.from(this.videoElement.children).find(child => elementIsTrackElement(child) && child.track.mode === 'showing')

        if(!activeTrackElement || ! elementIsTrackElement(activeTrackElement)) return

        const activeTrack = activeTrackElement.track

        this.cueStyleElement.innerHTML = await getVttStyles(activeTrackElement) || ''

        activeTrack.oncuechange = () => {
            const activeCues = Array.from(activeTrack.activeCues || [])

            const cueElements = activeCues.map(cue => {
                if (! cueIsVttCue(cue)) return

                const cueElement = document.createElement('div')
                cueElement.className = 'cue'

                const cuePosition = getCuePosition(cue)
                Object.entries(cuePosition).forEach(([key, value]) => {
                    cueElement.style.setProperty(`--cue-${key}`, value)
                })

                const cueTextElement = document.createElement('div')
                cueTextElement.className = 'cue__text'

                const cueFragment = cue.getCueAsHTML()

                cueTextElement.appendChild(cueFragment)
                cueElement.appendChild(cueTextElement)

                return cueElement
            })

            this.cueContainerElement.replaceChildren(...cueElements.filter(element => !!element))
        }
    }

    private initResize() {
        this.resizeObserver = new ResizeObserver(() => this.updateCueContainerStyle(
            this.cueContainerElement,
            this.videoElement,
        ))

        this.resizeObserver.observe(this.videoElement)
    }

    private updateCueContainerStyle (cueContainerElement: HTMLDivElement, videoPlayerElement: HTMLVideoElement) {
        const videoAspectRatio = videoPlayerElement.videoWidth / videoPlayerElement.videoHeight
        const containerAspectRatio = videoPlayerElement.clientWidth / videoPlayerElement.clientHeight

        cueContainerElement.style.setProperty(
            'width',
            (videoAspectRatio >= containerAspectRatio) ? '100%' : 'auto',
        )
        cueContainerElement.style.setProperty(
            'height',
            (videoAspectRatio < containerAspectRatio) ? '100%' : 'auto',
        )
        cueContainerElement.style.setProperty(
            'aspect-ratio',
            `${videoPlayerElement.videoWidth} / ${videoPlayerElement.videoHeight}`,
        )

    }

    private handleFullscreen() {
        if(document.fullscreenElement === this.videoElement) {
            this.videoElement.classList.remove('cues-hidden')
        } else {
            this.videoElement.classList.add('cues-hidden')
        }
    }

    public static createInstance(videoElement: HTMLVideoElement): CaptionPlayer {
        return new CaptionPlayer(videoElement)
    }
}