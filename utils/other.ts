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
