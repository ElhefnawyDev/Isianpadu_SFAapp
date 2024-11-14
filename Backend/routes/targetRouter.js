import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const targetRouter = express.Router();
targetRouter.use(express.json());
const prisma = new PrismaClient();

targetRouter.get("/", async (req, res) => {
  const { target_year } = req.query; // Get target_year from the query

  try {
    const filters = {};
    if (target_year) {
      filters.target_year = Number(target_year); // Ensure it's a number
    }

    const targets = await prisma.sfa_infotarget.findMany({
      where: filters, // Apply filters
    });

    console.log(targets);
    res.send({
      success: true,
      targets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch targets" });
  }
});

export default targetRouter;
