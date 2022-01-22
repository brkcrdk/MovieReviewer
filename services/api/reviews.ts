export const getReviews = async (movieId) => {
  const prom = await fetch(`/api/movie/reviews/${movieId}`);
  return await prom.json();
};
