// testMiddleware.js
import { PrismaClient } from '@prisma/client';

// Create an instance of the Prisma Client
const prisma = new PrismaClient();

// Middleware to handle invalid datetime values
prisma.$use(async (params, next) => {
  const result = await next(params);

  // Check if the result is an array (for findMany)
  if (Array.isArray(result)) {
    return result.map((item) => {
      if (item && item.deadline === '0000-00-00') {
        console.log("Invalid date found, setting to null");
        item.deadline = null; // Set invalid dates to null
      }
      return item;
    });
  }

  // If it's a single result (for findUnique or similar)
  if (result && result.deadline === '0000-00-00') {
    console.log("Invalid date found, setting to null");
    result.deadline = null; // Set invalid dates to null
  }

  return result; // Return the result (array or single object)
});

// Test function
async function testMiddleware() {
  // Simulate fetching data that would come from the database
  const simulatedData = [
    { deadline: '0000-00-00', id: 1 }, // Invalid date
    { deadline: '2024-11-01T00:00:00Z', id: 2 }, // Valid date
  ];

  // Process the simulated data through the middleware logic manually
  const modifiedData = simulatedData.map(item => {
    if (item.deadline === '0000-00-00') {
      console.log("Invalid date found, setting to null");
      item.deadline = null; // Set invalid dates to null
    }
    return item;
  });

  console.log("Modified data:", modifiedData);
}

// Run the test
testMiddleware().catch((error) => {
  console.error("Error during test:", error);
}).finally(async () => {
  await prisma.$disconnect(); // Disconnect the Prisma client
});
