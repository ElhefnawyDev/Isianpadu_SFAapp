import express from "express";
import { PrismaClient } from "@prisma/client";

const tenderTableRouter = express.Router();
tenderTableRouter.use(express.json());
const prisma = new PrismaClient();

// Route for sfa_tender
tenderTableRouter.get("/sfa_tenderTable", async (req, res) => {
  try {
    const { selected_year } = req.query; // Get the selected year from query parameters

    // Fetch and aggregate tender data
    const result = await prisma.sfa_tender.groupBy({
      by: ['id_sfa_client'],
      where: {
        id_sfa_stages: 5, // Only completed tenders
        delete_id: 0, // Exclude deleted records
        deadline: {
          gte: new Date(`${selected_year}-01-01`), // Filter by year
          lte: new Date(`${selected_year}-12-31`), // Filter by year
        }
      },
      _count: {
        id_sfa_client: true, // Count number of tenders per client
      },
      _sum: {
        tender_cost: true, // Sum tender cost per client
      },
    });

    // Get clients' names and format data
    const clientsData = result.map(async (item) => {
      const client = await prisma.sfa_client.findUnique({
        where: { client_id: item.id_sfa_client },
        select: { client_name: true },
      });

      return {
        client_name: client.client_name,
        tender_count: item._count.id_sfa_client,
        total_tender_cost: item._sum.tender_cost,
      };
    });

    const aggregatedData = await Promise.all(clientsData);

    res.json({ success: true, aggregatedData });
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch aggregated data" });
  }
});

// Route for Top 20 Clients
tenderTableRouter.get("/top20_clients", async (req, res) => {
  try {
    const { selected_year } = req.query; // Get the selected year from query parameters

    // Fetch and aggregate top 20 tender data
    const result = await prisma.sfa_tender.groupBy({
      by: ['id_sfa_client'],
      where: {
        delete_id: 0, // Exclude deleted records
        id_sfa_stages: {
          notIn: [1, 6], // Exclude stages 1 and 6
        },
        deadline: {
          gte: new Date(`${selected_year}-01-01`), // Filter by start of year
          lte: new Date(`${selected_year}-12-31`), // Filter by end of year
        }
      },
      _count: {
        id_sfa_client: true, // Count the number of tenders per client
      },
      _sum: {
        tender_cost: true, // Sum the tender cost per client
      },
      orderBy: {
        _sum: {
          tender_cost: 'desc', // Order by total tender cost descending
        }
      },
      take: 20, // Limit to top 20 clients
    });

    // Get clients' names and format data
    const clientsData = result.map(async (item) => {
      const client = await prisma.sfa_client.findUnique({
        where: { client_id: item.id_sfa_client },
        select: { client_name: true },
      });

      return {
        client_name: client.client_name,
        tender_count: item._count.id_sfa_client,
        total_tender_cost: item._sum.tender_cost,
      };
    });

    const top20Clients = await Promise.all(clientsData);

    res.json({ success: true, top20Clients });
  } catch (error) {
    console.error("Error fetching top 20 clients data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch top 20 clients data" });
  }
});


// Route for Top Client (Prospect)
tenderTableRouter.get("/top_client_prospect", async (req, res) => {
  try {
    const { selected_year } = req.query; // Get the selected year from query parameters

    // Fetch and aggregate prospective tender data
    const result = await prisma.sfa_tender.groupBy({
      by: ['id_sfa_client'],
      where: {
        id_sfa_stages: 1, // Only prospective tenders
        delete_id: 0, // Exclude deleted records
        deadline: {
          gte: new Date(`${selected_year}-01-01`), // Filter by start of the selected year
          lte: new Date(`${selected_year}-12-31`), // Filter by end of the selected year
        }
      },
      _count: {
        id_sfa_client: true, // Count the number of tenders per client
      },
      _sum: {
        tender_cost: true, // Sum the tender cost per client
      },
    });

    // Get client names and format data
    const prospectClientsData = result.map(async (item) => {
      const client = await prisma.sfa_client.findUnique({
        where: { client_id: item.id_sfa_client },
        select: { client_name: true },
      });

      return {
        client_name: client.client_name,
        tender_count: item._count.id_sfa_client,
        total_tender_cost: item._sum.tender_cost,
      };
    });

    const topClientProspect = await Promise.all(prospectClientsData);

    res.json({ success: true, topClientProspect });
  } catch (error) {
    console.error("Error fetching top client prospect data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch top client prospect data" });
  }
});


// Route for Top Category
tenderTableRouter.get("/top_category", async (req, res) => {
  try {
    const { selected_year } = req.query; // Get the selected year from query parameters

    // Fetch and aggregate tender data by category
    const result = await prisma.sfa_tender.groupBy({
      by: ['id_sfa_tender_category'],
      where: {
        delete_id: 0, // Exclude deleted records
        deadline: {
          gte: new Date(`${selected_year}-01-01`), // Filter by start of the selected year
          lte: new Date(`${selected_year}-12-31`), // Filter by end of the selected year
        }
      },
      _count: {
        id_sfa_tender_category: true, // Count tenders per category
      },
      _sum: {
        tender_cost: true, // Sum tender cost per category
      },
    });

    // Get category names and format data
    const categoryData = result.map(async (item) => {
      const category = await prisma.sfa_tender_category.findUnique({
        where: { tender_category_id: item.id_sfa_tender_category },
        select: { tender_category: true },
      });

      return {
        tender_category: category.tender_category,
        tender_count: item._count.id_sfa_tender_category,
        total_tender_cost: item._sum.tender_cost,
      };
    });

    const topCategoryData = await Promise.all(categoryData);

    // Calculate totals for submission count and tender cost
    const totalSubmission = topCategoryData.reduce((acc, cur) => acc + cur.tender_count, 0);
    const totalCost = topCategoryData.reduce((acc, cur) => acc + (cur.total_tender_cost || 0), 0);

    res.json({
      success: true,
      topCategoryData,
      totalSubmission,
      totalCost,
    });
  } catch (error) {
    console.error("Error fetching top category data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch top category data" });
  }
});

// Route for Top Category (Prospect)
tenderTableRouter.get("/top_category_prospect", async (req, res) => {
  try {
    const { selected_year } = req.query; // Get the selected year from query parameters

    // Fetch and aggregate tender data by category for prospects
    const result = await prisma.sfa_tender.groupBy({
      by: ['id_sfa_tender_category'],
      where: {
        id_sfa_stages: 1, // Only prospect tenders
        delete_id: 0, // Exclude deleted records
        deadline: {
          gte: new Date(`${selected_year}-01-01`), // Start of the selected year
          lte: new Date(`${selected_year}-12-31`), // End of the selected year
        }
      },
      _count: {
        id_sfa_tender_category: true, // Count tenders per category
      },
      _sum: {
        tender_cost: true, // Sum tender cost per category
      },
    });

    // Fetch category names and format the data
    const categoryProspectData = await Promise.all(result.map(async (item) => {
      const category = await prisma.sfa_tender_category.findUnique({
        where: { tender_category_id: item.id_sfa_tender_category },
        select: { tender_category: true },
      });

      return {
        tender_category: category.tender_category,
        tender_count: item._count.id_sfa_tender_category,
        total_tender_cost: item._sum.tender_cost,
      };
    }));

    // Calculate totals for prospect tenders
    const totalCategoryProspectCount = categoryProspectData.reduce((acc, cur) => acc + cur.tender_count, 0);
    const totalProspectCost = categoryProspectData.reduce((acc, cur) => acc + (cur.total_tender_cost || 0), 0);

    res.json({
      success: true,
      categoryProspectData,
      totalCategoryProspectCount,
      totalProspectCost,
    });
  } catch (error) {
    console.error("Error fetching top category prospect data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch top category prospect data" });
  }
});

// Route for Top Category (Won)
tenderTableRouter.get("/top_category_won", async (req, res) => {
  try {
    const { selected_year } = req.query; // Get the selected year from query parameters

    // Fetch and aggregate tender data by category for won tenders
    const result = await prisma.sfa_tender.groupBy({
      by: ['id_sfa_tender_category'],
      where: {
        id_sfa_stages: 5, // Only won tenders
        delete_id: 0, // Exclude deleted records
        deadline: {
          gte: new Date(`${selected_year}-01-01`), // Start of the selected year
          lte: new Date(`${selected_year}-12-31`), // End of the selected year
        }
      },
      _count: {
        id_sfa_tender_category: true, // Count tenders per category
      },
      _sum: {
        tender_value: true, // Sum tender value per category
      },
    });

    // Fetch category names and format the data
    const categoryWonData = await Promise.all(result.map(async (item) => {
      const category = await prisma.sfa_tender_category.findUnique({
        where: { tender_category_id: item.id_sfa_tender_category },
        select: { tender_category: true },
      });

      return {
        tender_category: category.tender_category,
        tender_count: item._count.id_sfa_tender_category,
        total_tender_value: item._sum.tender_value,
      };
    }));

    // Calculate total won value for all categories
    const totalWonValue = categoryWonData.reduce((acc, cur) => acc + (cur.total_tender_value || 0), 0);
    const totalWonCount = categoryWonData.reduce((acc, cur) => acc + cur.tender_count, 0);

    res.json({
      success: true,
      categoryWonData,
      totalWonCount,
      totalWonValue,
    });
  } catch (error) {
    console.error("Error fetching top category won data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch top category won data" });
  }
});


export default tenderTableRouter;
