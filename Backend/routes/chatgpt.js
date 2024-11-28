import express from "express";
import { PrismaClient } from "@prisma/client";
import { sha256 } from "js-sha256";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const chatbot = express.Router();
chatbot.use(express.json());
const prisma = new PrismaClient();

chatbot.get("/monthly-tender-data", async (req, res) => {
  const { selected_year } = req.query;

  // Ensure the selected_year parameter is provided
  if (!selected_year) {
      return res.status(400).json({ success: false, message: 'selected_year is required' });
  }

  try {
      let totalProjectsCurrentYear = 0;
      let totalAmountCurrentYear = 0; // Initialize as a number, not a string
      const data2 = [];

      // Loop through each month to get the project count and tender value
      for (let month = 1; month <= 12; month++) {
          const result = await prisma.sfa_tender.aggregate({
              _count: { _all: true },
              _sum: { tender_value: true },
              where: {
                  id_sfa_stages: 5,
                  delete_id: 0,
                  loa_date: {
                      gte: new Date(selected_year, month - 1, 1),
                      lt: new Date(selected_year, month, 1),
                  },
              },
          });

          const totalProjects = result._count._all || 0;
          const totalTenderValue = result._sum.tender_value || 0;

          // Update the totals for the year
          totalProjectsCurrentYear += totalProjects;
          totalAmountCurrentYear += parseFloat(totalTenderValue); // Ensure numeric addition

          // Push month and total_tender_value to data array
          const monthName = new Date(selected_year, month - 1).toLocaleString('default', { month: 'long' });
          data2.push({ month: monthName, amount: totalTenderValue });
      }



      // Send the JSON response
      res.json({
          success: true,
          data: data2,
          totalProjectsCurrentYear,
          totalAmountCurrentYear: totalAmountCurrentYear,
      });

  } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});



chatbot.get("/tender-aggregates", async (req, res) => {
  try {
    const selectedYear = req.query.selected_year;

    // Validate selectedYear
    if (!selectedYear || isNaN(selectedYear)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing 'selected_year' query parameter.",
      });
    }

    const year = parseInt(selectedYear, 10);
    const todayDate = new Date().toISOString().split("T")[0];

    // Fetch all tenders
    const tenders = await prisma.sfa_tender.findMany();

    // Helper function to format database dates
    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0];
    };

    const aggregatedData = {
      todaySubmission: tenders.filter(
        (tender) =>
          formatDate(tender.deadline) === todayDate && tender.display_notice_id === 1
      ).length,
      totalSubmission: tenders.filter(
        (tender) =>
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      totalEntry: tenders.filter(
        (tender) =>
          tender.id_sfa_stages !== 1 &&
          tender.id_sfa_stages !== 7 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      totalWon: tenders.filter(
        (tender) =>
          tender.id_sfa_stages === 5 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      applicationTender: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 1 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      mixedTender: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 2 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      hardwareTender: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 3 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      maintenanceTender: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 4 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      networkTender: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 5 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      ictInfra: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 6 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      systemTender: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 7 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
      softwareTender: tenders.filter(
        (tender) =>
          tender.id_sfa_tender_category === 8 &&
          tender.delete_id === 0 &&
          new Date(tender.deadline).getFullYear() === year
      ).length,
    };

    res.json({ success: true, year, aggregatedData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch tender aggregates" });
  }
});


chatbot.get('/sales_stage', async (req, res) => {
    const { selected_year } = req.query; // Read the year from query parameters
    if (!selected_year) {
        return res.status(400).json({ error: 'selected_year query parameter is required' });
    }

    try {
        // Fetch all stages dynamically from the database
        const sfa_stages = await prisma.sfa_stages.findMany();
        
        // Dynamically define predefined stages based on sfa_stages
        const predefinedStages = sfa_stages.map((stage) => ({
            stages_id: stage.stages_id,
            label: stage.stage_name,
        }));

        // Fetch tender values grouped by stages, excluding deleted tenders
        const stagesData = await prisma.sfa_tender.groupBy({
            by: ['id_sfa_stages'],
            _sum: {
                tender_value: true,
            },
            where: {
                delete_id: 0,
                deadline: {
                    gte: new Date(`${selected_year}-01-01`),
                    lte: new Date(`${selected_year}-12-31`),
                },
                id_sfa_stages: {
                    in: predefinedStages.map((stage) => stage.stages_id), // Use predefined stages
                },
            },
        });

        // Map the predefined stages and fill in missing data with zero
        const stages = predefinedStages.map((stage) => {
            const stageData = stagesData.find((data) => data.id_sfa_stages === stage.stages_id);
            const tenderValue = stageData ? Number(stageData._sum.tender_value) : 0; // Use zero if no data
            return {
                id: stage.stages_id,
                label: stage.label, // Fetch the label value
                Total_Value: tenderValue.toFixed(2),
            };
        });

        // Calculate total tender value
        const totalTenderValue = stages.reduce((sum, point) => sum + Number(point.Total_Value), 0);

        // Calculate percentages for each stage
        const funnelData = stages.map((point) => ({
            ...point,
            percentage: totalTenderValue > 0 ? ((point.Total_Value / totalTenderValue) * 100).toFixed(2) : "0.00",
        }));

        // Prepare response data
        const response = {
            stages: funnelData,
            total: totalTenderValue.toFixed(2),
            year: selected_year,
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching funnel data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



chatbot.get("/sfa_tender_Table", async (req, res) => {
  try {
    // Fetch all submission methods
    const sfa_subm_methods = await prisma.sfa_subm_method.findMany();
    const sfa_subm_type = await prisma.sfa_subm_type.findMany();
    const sfa_client = await prisma.sfa_client.findMany();
    const sfa_salesteam = await prisma.sfa_salesteam.findMany();
    const sfa_stages = await prisma.sfa_stages.findMany();
    const sfa_notice = await prisma.sfa_notice.findMany();
    const sfa_tender_category = await prisma.sfa_tender_category.findMany();

    // Fetch tenders
    const tenders = await prisma.sfa_tender.findMany({
      select: {
        tender_id: true,
        tender_code: true,
        tender_shortname: true,
        tender_fullname: true,
        id_sfa_subm_method: true,
        id_sfa_subm_type: true,
        id_sfa_client: true,
        id_adm_profileSP: true,
        id_adm_profileSA: true,
        id_adm_profilePS: true,
        id_sfa_stages: true,
        display_notice_id: true,
        id_sfa_tender_category: true,
        tender_cost: true,
        tender_purchase_amount: true,
        indicative_price: true,
        implement_period: true,
        contract_period: true,
        total_proposed_contract_value: true,
        scope_services: true,
        implement_plan: true,
        winning_implement_strategy: true,
        project_clarification: true,
        deadline: true,
        exp_project_start: true,
        status: true,
        remarks: true,
        delete_id: true,
        deleted_by: true,
        loa_date: true,
        tender_value: true,
      },
    });

    // Rename keys and match submission method
    const renamedTenders = tenders.map((tender) => {
      const sub_method = sfa_subm_methods.find(
        (method) => method.subm_method_id === tender.id_sfa_subm_method
      );
      const sub_type = sfa_subm_type.find(
        (method) => method.subm_type_id === tender.id_sfa_subm_type
      );
      const client = sfa_client.find(
        (method) => method.client_id === tender.id_sfa_client
      );
      const salesteam = sfa_salesteam.find(
        (method) => method.staff_id === tender.id_adm_profileSA
      );
      const stages = sfa_stages.find(
        (method) => method.stages_id === tender.id_sfa_stages
      );
      const notice = sfa_notice.find(
        (n) => n.notice_id === tender.display_notice_id
      );
      const tender_category = sfa_tender_category.find(
        (method) => method.tender_category_id === tender.id_sfa_tender_category
      );
      // Include related objects in notice
      const enrichedNotice = notice
        ? {
            ...notice,
            submissionMethod:
              sfa_subm_methods.find(
                (method) => method.subm_method_id === notice.id_sfa_subm_method
              ) || null,
            submissionType:
              sfa_subm_type.find(
                (type) => type.subm_type_id === notice.id_sfa_subm_type
              ) || null,
          }
        : null;

      return {
        tenderID: tender.tender_id,
        tenderCode: tender.tender_code,
        shortName: tender.tender_shortname,
        fullName: tender.tender_fullname,
        submissionMethod: sub_method ? sub_method.subm_method : null, // Return only subm_method value
        submissionType: sub_type ? sub_type.subm_type : null,
        client_details: client ? client.client_name : null,
        salesteam_details: salesteam || null,
        stage: stages ? stages.stage_name : null,
        notice_details: enrichedNotice, // Include enriched notice
        tenderCategory: tender_category
          ? tender_category.tender_category
          : null,
        tender_cost: tender.tender_cost,
        tender_value: tender.tender_value,
        contractPeriod: tender.contract_period,
        proposedContractValue: tender.total_proposed_contract_value,
        deadline: tender.deadline,
        expectedProjectStart: tender.exp_project_start,
        status: tender.status,
        remarks: tender.remarks,
        loaDate: tender.loa_date,
      };
    });

    console.log(renamedTenders);
    res.send({ success: true, tenders: renamedTenders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch sfa_tender data" });
  }
});

export default chatbot;
