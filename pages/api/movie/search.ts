// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

function getUrl(query: string) {
  const baseUrl = "https://api.themoviedb.org/3";
  return `${baseUrl}/${query}?api_key=ec85078d4b191f71aa0b11f8e69052f3`;
}

async function searchMovie(movieName: string) {
  return await fetch(getUrl("search/movie") + `&query=${movieName}`);
}

export default async function handler(req, res) {
  const { name } = req.query;
  const data = await searchMovie(name);
  res.status(200).json(data.body);
}
