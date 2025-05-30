export const isNumber = (value: unknown): value is number => typeof value === 'number'

export const elementIsTrackElement = (element: Element): element is HTMLTrackElement => element.tagName === 'TRACK'

export const cueIsVttCue = (cue: TextTrackCue): cue is VTTCue => 'getCueAsHTML' in cue