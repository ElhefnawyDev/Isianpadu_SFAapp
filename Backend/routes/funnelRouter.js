import express from 'express';
import { PrismaClient } from '@prisma/client';

const funnelChart = express.Router();
const prisma = new PrismaClient();

// Endpoint to get funnel data by year
funnelChart.get('/funnelRouter', async (req, res) => {
  const { selected_year } = req.query; // Read the year from query parameters
  if (!selected_year) {
    return res.status(400).json({ error: 'selected_year query parameter is required' });
  }

  try {
    // Fetch tender values grouped by stages, excluding deleted tenders and specific stages
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
          not: 6,
        },
      },
    });

    // Fetch stage names for each stage ID
    const stagesNames = await prisma.sfa_stages.findMany({
      where: {
        stages_id: { in: stagesData.map((stage) => stage.id_sfa_stages) },
      },
      select: {
        stages_id: true,
        stage_name: true,
      },
    });

    // Initialize totalTenderValue to 0
    let totalTenderValue = 0;
    const dataPoints = stagesData.map((stage) => {
      const stageName = stagesNames.find((s) => s.stages_id === stage.id_sfa_stages)?.stage_name || 'Unknown';
      const tenderValue = Number(stage._sum.tender_value) || 0; // Ensure tenderValue is a number
      totalTenderValue += tenderValue;
      return {
        id: stage.id_sfa_stages,
        label: stageName,
        Total_Value: tenderValue.toFixed(2),
      };
    });

    // Calculate percentages for each stage
    const funnelData = dataPoints.map((point) => ({
      ...point,
      percentage: ((point.Total_Value / totalTenderValue) * 100).toFixed(2),
    }));

    // Prepare response data
    const response = {
      dataPoints: funnelData,
      total: totalTenderValue.toFixed(2),
      year: selected_year,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default funnelChart;
