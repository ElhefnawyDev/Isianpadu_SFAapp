import express from "express";
import { PrismaClient } from "@prisma/client";
const wonIn2007To2024Router = express.Router();

// Initialize Prisma client
const prisma = new PrismaClient();

wonIn2007To2024Router.get("/wonIn2007To2024", async (req, res) => {
  try {
    const selectedYear =
      parseInt(req.query.selected_year) || new Date().getFullYear();
    let data = [];
    let totalProjects = 0;
    let totalAmount = 0;

    for (let year = 2007; year <= selectedYear; year++) {
      // Fetch total projects and total tender value from the database
      const result = await prisma.sfa_tender.aggregate({
        _count: { _all: true },
        _sum: { tender_value: true },
        where: {
          id_sfa_stages: 5,
          delete_id: 0,
          loa_date: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
      });

      const sumTenderValue = Number(result._sum.tender_value) || 0;
      const countAll = result._count._all || 0;

      if (countAll > 0) {
        totalProjects += countAll;
        totalAmount += sumTenderValue;

        // Add year and total_tender_value to data array
        data.push({ year: year.toString(), amount: sumTenderValue });
      } else {
        data.push({ year: year.toString(), amount: 0 });
      }
    }

    // Return data as JSON response
    res.json({
      data: data,
      totalProjects: totalProjects,
      totalAmount: totalAmount,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

export default wonIn2007To2024Router;
