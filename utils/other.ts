export function splitText(what: string, length: number): string {
  const oldWhat = what;
  const overviewArr = what.split("");
  overviewArr[length] = "§";
  const stringOverview = overviewArr.join("");
  const niceOverview = stringOverview.split("§")[0];
  if (!(oldWhat === niceOverview)) {
    return `${niceOverview}... `;
  }
  return niceOverview;
}

export function toBase64(str: string) {
  const buffer = Buffer.from(str);

  return buffer.toString("base64");
}

export function fromBase64(str: string) {
  const buffer = Buffer.from(str, "base64");
  return buffer.toString();
}
