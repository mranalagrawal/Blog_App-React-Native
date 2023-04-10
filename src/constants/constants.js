import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };

/* 

Return a number that is calculated by dividing the height and width of your 
device (which we get from the Dimensions API) by the guideline-based width and adding the
 pixel value you passed to the component. This calculation will ultimately return a number (pixel value) 
that is equivalent to the static pixel value we’ve given for that particular device.

usages
=========
verticalScale:
----------------
height , MarginTop , MarginTop, marginBottom , marginVartical, line-heights
paddingTop , PaddingBottom , paddingVartical

horizontalScale:
-------------------
width , MarginRigt , marginLeft , marginHorizontal, line-heights
paddingTop , PaddingBottom , paddingHorizontal

moderateScale:
------------------
fontSize, borders and likewise

*/