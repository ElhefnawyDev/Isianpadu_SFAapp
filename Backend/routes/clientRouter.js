import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const clientRouter = express.Router();

// Route to get all clients
clientRouter.get("/sfa_client", async (req, res) => {
  try {
    const clients = await prisma.sfa_client.findMany({
      select: {
        client_id: true,
        client_name: true,
        client_address: true,
        client_postcode: true,
        client_city: true,
        client_state: true,
      },
    });
    res.json({ success: true, clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ success: false, message: "Failed to fetch client data" });
  }
});

export default clientRouter;
