import type { NextApiRequest, NextApiResponse } from "next";

function getUrl(query: string) {
  const baseUrl = "https://api.themoviedb.org/3/";
  return `${baseUrl}/${query}?api_key=ec85078d4b191f71aa0b11f8e69052f3`;
}

async function getReviews(movieId: string) {
  const prom = await fetch(getUrl(`/movie/${movieId}/reviews`));
  return await prom.json();
}

export default async function handler(req, res: NextApiResponse<any>) {
  const { movieId } = req.query;

  const { results: data } = await getReviews(movieId);
  res.status(200).send(data);

  // res.status(200).send(getImage(imageId));
}
