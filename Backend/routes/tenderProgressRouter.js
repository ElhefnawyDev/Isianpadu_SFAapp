import express from "express";
import { PrismaClient } from "@prisma/client";

const tenderProgressRouter = express.Router();
tenderProgressRouter.use(express.json());
const prisma = new PrismaClient();

tenderProgressRouter.get("/tenderProgressRouter", async (req, res) => {
  try {
    const selected_year = req.query.selected_year;
    if (!selected_year) {
      return res
        .status(400)
        .send({ success: false, message: "selected_year query parameter is required" });
    }

    const selectedYearInt = parseInt(selected_year);

    // Fetch total_tender_value for selected year
    const totalTenderResult = await prisma.sfa_tender.aggregate({
      _sum: {
        tender_value: true,
      },
      where: {
        id_sfa_stages: 5,
        delete_id: 0,
        loa_date: {
          gte: new Date(`${selected_year}-01-01`),
          lte: new Date(`${selected_year}-12-31`),
        },
      },
    });

    const total_tender_value = totalTenderResult._sum.tender_value || 0;
    const formatted_total_tender_value = total_tender_value.toFixed(2);

    // Fetch min_target and target for selected year
    const targetResult = await prisma.sfa_infotarget.findFirst({
      where: {
        target_year: selectedYearInt,
      },
      select: {
        target_value: true,
        minimum_target: true,
      },
    });

    let min_target = 0;
    let target = 0;

    if (targetResult) {
      min_target = targetResult.minimum_target || 0;
      target = targetResult.target_value || 0;
    }

    const formatted_min_target = min_target.toFixed(2);

    // Calculate percentages
    let percentage = 0;
    let percent = "0.00";

    if (min_target !== 0) {
      percentage = (total_tender_value / min_target) * 100;
      percent = percentage.toFixed(2);
    }

    let yearly_target = target.toFixed(2);
    let target_percentage = "0.00";

    if (target !== 0) {
      const targetPercent = (total_tender_value / target) * 100;
      target_percentage = targetPercent.toFixed(2);
    }

    // Fetch total_tender_value for 5-year period
    const totalTenderResult5Years = await prisma.sfa_tender.aggregate({
      _sum: {
        tender_value: true,
      },
      where: {
        id_sfa_stages: 5,
        delete_id: 0,
        loa_date: {
          gte: new Date("2021-01-01"),
          lte: new Date("2025-12-31"),
        },
      },
    });

    const total_tender_value_5_years = totalTenderResult5Years._sum.tender_value || 0;
    const formatted_total_tender_value_5_years = total_tender_value_5_years.toFixed(2);

    // Fetch min_target and target for 5-year period
    const targetResult5Years = await prisma.sfa_infotarget.aggregate({
      _sum: {
        minimum_target: true,
        target_value: true,
      },
      where: {
        target_year: {
          gte: 2021,
          lte: 2025,
        },
      },
    });

    const min_target_5_years = targetResult5Years._sum.minimum_target || 0;
    const target_5_years = targetResult5Years._sum.target_value || 0;

    const formatted_min_target_5_years = min_target_5_years.toFixed(2);

    // Calculate percentages for 5-year period
    let percentage_5_years = 0;
    let percent_5_years = "0.00";

    if (min_target_5_years !== 0) {
      percentage_5_years = (total_tender_value_5_years / min_target_5_years) * 100;
      percent_5_years = percentage_5_years.toFixed(2);
    }

    let yearly_target_5_years = target_5_years.toFixed(2);
    let target_percentage_5_years = "0.00";

    if (target_5_years !== 0) {
      const targetPercent5Years = (total_tender_value_5_years / target_5_years) * 100;
      target_percentage_5_years = targetPercent5Years.toFixed(2);
    }

    res.send({
      success: true,
      data: {
        total_tender_value: formatted_total_tender_value,
        min_target: formatted_min_target,
        percentage: percent,
        target_percentage: target_percentage,
        yearly_target: yearly_target,
        total_tender_value_5_years: formatted_total_tender_value_5_years,
        min_target_5_years: formatted_min_target_5_years,
        percentage_5_years: percent_5_years,
        target_percentage_5_years: target_percentage_5_years,
        yearly_target_5_years: yearly_target_5_years,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch sfa_tender data" });
  }
});

export default tenderProgressRouter;
