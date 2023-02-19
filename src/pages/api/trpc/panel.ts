import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "../../../server/api/root";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: `${env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/trpc`,
      transformer: "superjson",
    })
  );
}
