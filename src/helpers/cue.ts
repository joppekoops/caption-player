import type { CuePosition, CueProperties } from '../entities'
import { isNumber } from '../helpers'

const getLineValue = (line: number, snapToLines: boolean): string =>
    snapToLines ? `${Math.abs(line)}rem` : `${Math.abs(line)}%`

export const getCueTop = (line: LineAndPositionSetting, snapToLines: boolean): string =>
    (isNumber(line) && line >= 0)
        ? getLineValue(line, snapToLines)
        : 'auto'

export const getCueBottom = (line: LineAndPositionSetting, snapToLines: boolean): string => {
    if (isNumber(line) && line < 0) {
        return getLineValue(line, snapToLines)
    } else if (getCueTop(line, snapToLines) === 'auto') {
        return '20%'
    }

    return 'auto'
}

export const getCueLeft = (position: LineAndPositionSetting, align: AlignSetting): string =>
    isNumber(position) && (align === 'left' || align === 'start')
        ? `${position}%`
        : '0%'

export const getCueWidth = (position: LineAndPositionSetting, align: AlignSetting): string => {
    if (! isNumber(position)) {
        return '100%'
    } else if (align === 'end' || align === 'right') {
        return `${position}%`
    } else if (align === 'center') {
        return `${position * 2}%`
    }

    return '100%'
}

export const getCuePosition = (cueProperties: CueProperties): CuePosition => ({
    align: cueProperties.align,
    top: getCueTop(cueProperties.line, cueProperties.snapToLines),
    bottom: getCueBottom(cueProperties.line, cueProperties.snapToLines),
    left: getCueLeft(cueProperties.position, cueProperties.align),
    width: getCueWidth(cueProperties.position, cueProperties.align),
    size: cueProperties.size,
    duration: cueProperties.endTime - cueProperties.startTime,
})