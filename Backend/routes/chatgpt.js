import express from "express";
import { PrismaClient } from "@prisma/client";
import { sha256 } from "js-sha256";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const chatbot = express.Router();
chatbot.use(express.json());
const prisma = new PrismaClient();

chatbot.get("/tender_Progress", async (req, res) => {
  try {
    const selected_year = req.query.selected_year;
    if (!selected_year) {
      return res
        .status(400)
        .send({
          success: false,
          message: "selected_year query parameter is required",
        });
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

    const total_tender_value_5_years =
      totalTenderResult5Years._sum.tender_value || 0;
    const formatted_total_tender_value_5_years =
      total_tender_value_5_years.toFixed(2);

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
      percentage_5_years =
        (total_tender_value_5_years / min_target_5_years) * 100;
      percent_5_years = percentage_5_years.toFixed(2);
    }

    let yearly_target_5_years = target_5_years.toFixed(2);
    let target_percentage_5_years = "0.00";

    if (target_5_years !== 0) {
      const targetPercent5Years =
        (total_tender_value_5_years / target_5_years) * 100;
      target_percentage_5_years = targetPercent5Years.toFixed(2);
    }

    res.send({
      success: true,
      data: {
        total_tender_value: formatted_total_tender_value,
        minimum_target: formatted_min_target,
        percentage_of_the_target_already_reached: percent,
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
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch sfa_tender data" });
  }
});

chatbot.get("/tender_year_month", async (req, res) => {
  const { selected_year } = req.query;

  // Ensure the selected_year parameter is provided
  if (!selected_year) {
    return res
      .status(400)
      .json({ success: false, message: "selected_year is required" });
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
      const monthName = new Date(selected_year, month - 1).toLocaleString(
        "default",
        { month: "long" }
      );
      data2.push({ month: monthName, amount: totalTenderValue });
    }

    res.json({
      won_by_months: data2,
      totalProjectsCurrentYear,
      totalAmountCurrentYear: totalAmountCurrentYear,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

chatbot.get("/monthly-tender-data", async (req, res) => {
  const { selected_year } = req.query;

  // Ensure the selected_year parameter is provided
  if (!selected_year) {
    return res
      .status(400)
      .json({ success: false, message: "selected_year is required" });
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
      const monthName = new Date(selected_year, month - 1).toLocaleString(
        "default",
        { month: "long" }
      );
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
    console.error("Error fetching data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

chatbot.get("/tender_stages_sfa", async (req, res) => {
  try {
    const { sfaStage, selected_year } = req.query;

    if (!sfaStage) {
      return res
        .status(400)
        .send({ success: false, message: "sfa stage id is required" });
    }

    if (!selected_year) {
      return res.status(400).send({
        success: false,
        message: "selected_year parameter is required",
      });
    }

    // Define the query condition for deadline based on selected_year
    let deadlineCondition;
    if (selected_year.toLowerCase() === "null") {
      // If selected_year is "null", fetch tenders with null deadline
      deadlineCondition = { deadline: null };
    } else {
      // Otherwise, filter tenders by the selected year
      const year = parseInt(selected_year, 10);
      deadlineCondition = {
        deadline: {
          gte: new Date(`${year}-01-01`), // From January 1st of the selected year
          lte: new Date(`${year}-12-31`), // Until December 31st of the selected year
        },
      };
    }

    // Fetch data from the `sfa_tender` table with filtering by year (or null deadline)
    const tenders = await prisma.sfa_tender.findMany({
      where: {
        delete_id: 0,
        id_sfa_stages: parseInt(sfaStage),
        ...deadlineCondition, // Apply the deadline condition dynamically
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
        year: tender.deadline, // Extract year from deadline
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

chatbot.get("/tender_aggregates", async (req, res) => {
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
          formatDate(tender.deadline) === todayDate &&
          tender.display_notice_id === 1
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

chatbot.get("/sales_stage", async (req, res) => {
  const { selected_year } = req.query; // Read the year from query parameters
  if (!selected_year) {
    return res
      .status(400)
      .json({ error: "selected_year query parameter is required" });
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
      by: ["id_sfa_stages"],
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
      const stageData = stagesData.find(
        (data) => data.id_sfa_stages === stage.stages_id
      );
      const tenderValue = stageData ? Number(stageData._sum.tender_value) : 0; // Use zero if no data
      return {
        id: stage.stages_id,
        label: stage.label, // Fetch the label value
        Total_Value: tenderValue.toFixed(2),
      };
    });

    // Calculate total tender value
    const totalTenderValue = stages.reduce(
      (sum, point) => sum + Number(point.Total_Value),
      0
    );

    // Calculate percentages for each stage
    const funnelData = stages.map((point) => ({
      ...point,
      percentage:
        totalTenderValue > 0
          ? ((point.Total_Value / totalTenderValue) * 100).toFixed(2)
          : "0.00",
    }));

    // Prepare response data
    const response = {
      stages: funnelData,
      total: totalTenderValue.toFixed(2),
      year: selected_year,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching funnel data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



chatbot.get("/sales_team_tender_List", async (req, res) => {
  try {
    // Extract salesteamID from query parameters
    const { salesteamID } = req.query;
    
    if (!salesteamID) {
      return res.status(400).send({ success: false, message: "salesteamID is required" });
    }

    // Fetch all necessary data from the database
    const sfa_salesteam = await prisma.sfa_salesteam.findMany(); // Fetch all sales teams
    const sfa_tender = await prisma.sfa_tender.findMany(); // Fetch all tenders
    const sfa_subm_methods = await prisma.sfa_subm_method.findMany();
    const sfa_subm_type = await prisma.sfa_subm_type.findMany();
    const sfa_client = await prisma.sfa_client.findMany();
    const sfa_stages = await prisma.sfa_stages.findMany();
    const sfa_notice = await prisma.sfa_notice.findMany();
    const sfa_tender_category = await prisma.sfa_tender_category.findMany();

    // Check if the provided salesteamID exists in the database
    const salesteam = sfa_salesteam.find((team) => team.staff_id === parseInt(salesteamID));
    
    if (!salesteam) {
      return res.status(404).send({ success: false, message: "Sales team not found" });
    }

    // Filter tenders assigned to this specific sales team
    const associatedTenders = sfa_tender.filter(
      (tender) => tender.id_adm_profileSA === salesteam.staff_id
    );

    // Enrich tender details
    const enrichedTenders = associatedTenders.map((tender) => {
      const sub_method = sfa_subm_methods.find(
        (method) => method.subm_method_id === tender.id_sfa_subm_method
      );
      const sub_type = sfa_subm_type.find(
        (method) => method.subm_type_id === tender.id_sfa_subm_type
      );
      const client = sfa_client.find(
        (method) => method.client_id === tender.id_sfa_client
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
        submissionMethod: sub_method ? sub_method.subm_method : null,
        submissionType: sub_type ? sub_type.subm_type : null,
        client_details: client ? client.client_name : null,
        stage: stages ? stages.stage_name : null,
        notice_details: enrichedNotice, // Include enriched notice
        tenderCategory: tender_category ? tender_category.tender_category : null,
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

    // Return the sales team and their associated tenders
    res.send({
      success: true,
      salesteamID: salesteam.staff_id,
      salesteamName: salesteam.name,
      tenders: enrichedTenders.length > 0 ? enrichedTenders : 0,
      tenderCount: enrichedTenders.length, // Count of associated tenders
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch sales team data" });
  }
});

chatbot.get("/sales_team_list", async (req, res) => {
  try {
    // Fetch all sales teams and tenders
    const sfa_salesteam = await prisma.sfa_salesteam.findMany(); // Fetch all sales teams
    const sfa_tender = await prisma.sfa_tender.findMany(); // Fetch all tenders

    // Map sales teams to their tender count (only "Won" tenders)
    const salesteamTenderCounts = sfa_salesteam.map((salesteam) => {
      // Find all tenders assigned to the current sales team with stage "Won"
      const associatedTenders = sfa_tender.filter(
        (tender) =>
          tender.id_adm_profileSA === salesteam.staff_id &&
          tender.id_sfa_stages === 5 // Only count tenders where status is "Won"
      );

      // Return sales team ID, name, and the count of "Won" tenders
      return {
        salesteamID: salesteam.staff_id,
        salesteamName: salesteam.name,
        tenderCount: associatedTenders.length,
      };
    });

    // Send the response with the sales team and tender counts
    res.send({
      success: true,
      salesteamTenderCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch sales team tender counts" });
  }
});




export default chatbot;
