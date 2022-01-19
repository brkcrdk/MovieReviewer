import type { NextApiRequest, NextApiResponse } from "next";

function getUrl(query: string) {
  const baseUrl = "https://image.tmdb.org";
  return `${baseUrl}/${query}?api_key=ec85078d4b191f71aa0b11f8e69052f3`;
}

function getImage(imageId) {
  const url = getUrl(`/t/p/w500/${imageId}`);
  return url;
}

export default async function handler(req, res: NextApiResponse<any>) {
  const imageId = req.query.imageId;
  res.status(200).send(getImage(imageId));
}
