import { NextApiRequest, NextApiResponse } from "next";
import { makeOwner } from "../../../../seed/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await makeOwner(
      "Owner123",
      "firstname",
      "lastname",
      "0987654321",
      "Bangkok",
      "uri123",
      ["Dog", "Cat"]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: false, message: "User already exists" });
  }
}
