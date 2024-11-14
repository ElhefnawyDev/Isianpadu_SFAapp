import express from 'express';
import { PrismaClient } from '@prisma/client';

const chart2 = express.Router();
const prisma = new PrismaClient();

// Define the route
chart2.get('/chart2', async (req, res) => {
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

        // Format totalAmountCurrentYear as currency
        const formattedTotalAmountCurrentYear = totalAmountCurrentYear.toLocaleString('en-US', { 
            style: 'currency', 
            currency: 'MYR',
            minimumFractionDigits: 2 
        });

        // Send the JSON response
        res.json({
            success: true,
            data: data2,
            totalProjectsCurrentYear,
            totalAmountCurrentYear: formattedTotalAmountCurrentYear,
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default chart2;
