export default function formaterBase64ToSVG(imageBase64SVG) {
  const metadataBuffer = Buffer.from(imageBase64SVG.split(",")[1], "base64");
  const metadataString = metadataBuffer.toString("utf-8");
  const imageBase64 = JSON.parse(metadataString).image;
  const imageSvg = Buffer.from(imageBase64.split(",")[1], "base64");
  const metadataStringSvg = imageSvg.toString("utf-8");
  return metadataStringSvg;
}
