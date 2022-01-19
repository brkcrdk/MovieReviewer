function getUrl(query: string) {
  const baseUrl = "https://api.themoviedb.org/3";
  return `${baseUrl}/${query}?api_key=ec85078d4b191f71aa0b11f8e69052f3`;
}

function getDetails(movieId) {
  const url = getUrl(`movie/${movieId}`);
  return fetch(url);
}

export default async function handler(req, res) {
  const { movieId } = req.query;
  const { body: data } = await getDetails(movieId);
  res.status(200).json(data);
}
