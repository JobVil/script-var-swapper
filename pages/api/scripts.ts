import { PrismaClient, Prisma, Script } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id: string;
  title: string;
  value: string;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as Data;
    const prisma = new PrismaClient();

    console.log(
      "[user] Incoming request:",
      JSON.stringify(
        {
          method: req.method,
          query: req.query,
          body: req.body,
        },
        null,
        2
      )
    );

    switch (req.method) {
      case "GET":
        if (!id) {
          return res.json(await prisma.script.findMany());
        }
        return res.json(await prisma.script.findMany({ where: { id } }));
      case "POST":
        return res.json(
          await prisma.script.create({
            data: JSON.parse(req.body) as Prisma.ScriptCreateInput,
          })
        );
      case "PUT":
        return res.json(
          await prisma.script.update({
            where: {
              id,
            },
            data: req.body as Prisma.ScriptUpdateInput,
          })
        );
      case "DELETE":
        return res.json(
          await prisma.script.delete({
            where: { id },
          })
        );
    }

    return res
      .status(400)
      .send({ message: `Unexpected request method: ${req.method}` });
  } catch (e: any) {
    console.error("[user] Error responding:", e);
    return res.status(500).json({ message: e?.message || e });
  }
}
