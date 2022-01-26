import supabaseClient from "Utils/supabaseClient";

export default async function Handler(req, res) {
  const { userId } = req.query;
  const { data, error } = await supabaseClient
    .from("users")
    .select()
    .eq("user_id", userId);
  res.status(200).json({ data, error });
}
