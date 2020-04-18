function getFontFromComputedStyle(computedStyle) {
  const { font } = computedStyle;
  // Firefox returns the empty string for .font, so create the .font property manually
  if (font !== '') {
    // Firefox uses percentages for font-stretch, but Canvas does not accept percentages
    // so convert to keywords, as listed at:
    //   https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch
    const fontStretchLookupTable = {
      '50%': 'ultra-condensed',
      '62.5%': 'extra-condensed',
      '75%': 'condensed',
      '87.5%': 'semi-condensed',
      '100%': 'normal',
      '112.5%': 'semi-expanded',
      '125%': 'expanded',
      '150%': 'extra-expanded',
      '200%': 'ultra-expanded',
    };
      // If the retrieved font-stretch percentage isn't found in the lookup table, use
      // 'normal' as a last resort.
    const fontStretch = fontStretchLookupTable.hasOwnProperty(computedStyle.fontStretch)
      ? fontStretchLookupTable[computedStyle.fontStretch]
      : 'normal';
    const {
      fontStyle, fontVariant, fontWeight, fontSize, lineHeight, fontFamily,
    } = computedStyle;
    return {
      fontStretch,
      fontStyle,
      fontVariant,
      fontWeight,
      fontSize,
      lineHeight,
      fontFamily,
    };
  }
}


export default getFontFromComputedStyle;
