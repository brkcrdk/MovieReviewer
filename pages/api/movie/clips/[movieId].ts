import type { NextApiRequest, NextApiResponse } from "next";

function getUrl(query: string) {
  const baseUrl = "https://api.themoviedb.org/3/";
  return `${baseUrl}/${query}?api_key=ec85078d4b191f71aa0b11f8e69052f3`;
}

function getMovie(movieId) {
  const url = getUrl(`movie/${movieId}/videos`);
  return url;
}

export default async function SendMovie(req, res) {
  const { movieId } = req.query;
  const prom = await fetch(getMovie(movieId));
  const { results: data } = await prom.json();
  res.status(200).send(data.at(-2));
}
