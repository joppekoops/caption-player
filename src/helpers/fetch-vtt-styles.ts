export const getVttStyles = async (trackElement: HTMLTrackElement) => {
    try {
        const result = await fetch(trackElement.src)
        const vtt = await result.text()
        return Array.from(vtt.matchAll(/STYLE(.*?)\n\n/gms))[0][1]
            .replaceAll(/::cue\((.*?)\)|/g, '$1')
            .replaceAll(/::cue/g, '.cue')
    } catch (error) {
        console.error(error)
    }
}