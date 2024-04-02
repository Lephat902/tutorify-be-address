export function removeLeadingZero(str: string) {
    return str.replace(/\b0+([1-9]\d*|0)\b/g, '$1');
}