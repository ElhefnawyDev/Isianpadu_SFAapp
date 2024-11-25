import express from "express";
import { PrismaClient } from "@prisma/client";

const tenderStageTable = express.Router();
tenderStageTable.use(express.json());
const prisma = new PrismaClient();

tenderStageTable.get("/tender_stages", async (req, res) => {
  try {
    const { sfaStage } = req.query;
    if (!sfaStage) {
      return res
        .status(400)
        .send({ success: false, message: "sfa stage id is required" });
    }
    // Fetch data from the `sfa_tender` table
    const tenders = await prisma.sfa_tender.findMany({
      where: {
        delete_id: 0,
        id_sfa_stages: parseInt(sfaStage),
      },
      orderBy: {
        deadline: "desc",
      },
    });

    let totalTenderValueWon = 0;
    const dataArray = [];

    for (const tender of tenders) {
      // Fetch related data using Prisma's relation capabilities
      const client = await prisma.sfa_client.findUnique({
        where: { client_id: tender.id_sfa_client },
      });
      const tenderCategory = await prisma.sfa_tender_category.findUnique({
        where: { tender_category_id: tender.id_sfa_tender_category },
      });
      const salesPerson = await prisma.sfa_salesteam.findUnique({
        where: { staff_id: tender.id_adm_profileSP },
      });

      // Update the total tender value won
      totalTenderValueWon += parseFloat(tender.tender_value || 0);

      // Prepare the data object for each row
      const data = {
        tenderId: tender.tender_id,
        clientName: client?.client_name || "Unknown Client",
        tenderCategory: tenderCategory?.tender_category || "Unknown Category",
        deadline: new Date(tender.deadline).toLocaleDateString("en-GB"),
        tenderValue: parseFloat(tender.tender_value || 0).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2 }
        ),
        tenderCost: parseFloat(tender.tender_cost || 0).toLocaleString(
          "en-US",
          { minimumFractionDigits: 2 }
        ),
        salesPerson: salesPerson?.name || "Not Specified",
        loaDate: tender.loa_date,
        status: tender.status,
        tenderShortname: tender.tender_shortname,
      };
      dataArray.push(data);
    }

    // Send the response with the total tender value and data array
    res.json({
      data: dataArray,
      total_tender_value_won: totalTenderValueWon.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      }),
    });
  } catch (error) {
    console.error("Error fetching tender data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default tenderStageTable;
