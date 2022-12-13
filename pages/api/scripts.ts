import { PrismaClient, Prisma, Script } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

type Data = {
  id: string;
  title: string;
  value: string;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as Data;

    switch (req.method) {
      case "GET":
        if (!id) {
          return res.json((await prisma.script.findMany()).sort((a,b) => {return a.title > b.title ? 1 : -1}));
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
