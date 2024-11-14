import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
router.use(express.json());
const prisma = new PrismaClient();

// Route for adm_profile model
router.get("/adm_profile", async (req, res) => {
  try {
    const profiles = await prisma.adm_profile.findMany();
    res.send({ success: true, profiles });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch adm_profile data" });
  }
});

// // Route for adm_user model
// router.get('/adm_user', async (req, res) => {
//     try {
//         const users = await prisma.adm_user.findMany();
//         res.send({ success: true, users });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ success: false, message: 'Failed to fetch adm_user data' });
//     }
// });

// Route for bok_asset model
router.get("/bok_asset", async (req, res) => {
  try {
    const assets = await prisma.bok_asset.findMany();
    res.send({ success: true, assets });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch bok_asset data" });
  }
});

// Route for bok_location model
router.get("/bok_location", async (req, res) => {
  try {
    const locations = await prisma.bok_location.findMany();
    res.send({ success: true, locations });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch bok_location data" });
  }
});

// Route for bok_room model
router.get("/bok_room", async (req, res) => {
  try {
    const rooms = await prisma.bok_room.findMany();
    res.send({ success: true, rooms });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch bok_room data" });
  }
});

// Route for bok_room_book model
router.get("/bok_room_book", async (req, res) => {
  try {
    const roomBooks = await prisma.bok_room_book.findMany();
    res.send({ success: true, roomBooks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch bok_room_book data" });
  }
});

// Route for category model
router.get("/category", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.send({ success: true, categories });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch category data" });
  }
});

// Route for lkp_book_status model
router.get("/lkp_book_status", async (req, res) => {
  try {
    const bookStatuses = await prisma.lkp_book_status.findMany();
    res.send({ success: true, bookStatuses });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch lkp_book_status data",
      });
  }
});

// Route for lkp_country model
router.get("/lkp_country", async (req, res) => {
  try {
    const countries = await prisma.lkp_country.findMany();
    res.send({ success: true, countries });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch lkp_country data" });
  }
});

// Route for lkp_district model
router.get("/lkp_district", async (req, res) => {
  try {
    const districts = await prisma.lkp_district.findMany();
    res.send({ success: true, districts });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch lkp_district data" });
  }
});

// Route for lkp_profile_type model
router.get("/lkp_profile_type", async (req, res) => {
  try {
    const profileTypes = await prisma.lkp_profile_type.findMany();
    res.send({ success: true, profileTypes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch lkp_profile_type data",
      });
  }
});

// Route for lkp_state model
router.get("/lkp_state", async (req, res) => {
  try {
    const states = await prisma.lkp_state.findMany();
    res.send({ success: true, states });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch lkp_state data" });
  }
});

// Route for lkp_status_active model
router.get("/lkp_status_active", async (req, res) => {
  try {
    const statusActives = await prisma.lkp_status_active.findMany();
    res.send({ success: true, statusActives });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch lkp_status_active data",
      });
  }
});

// Route for org_organization model
router.get("/org_organization", async (req, res) => {
  try {
    const organizations = await prisma.org_organization.findMany();
    res.send({ success: true, organizations });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch org_organization data",
      });
  }
});

// Route for org_organization_type model
router.get("/org_organization_type", async (req, res) => {
  try {
    const organizationTypes = await prisma.org_organization_type.findMany();
    res.send({ success: true, organizationTypes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch org_organization_type data",
      });
  }
});

// Route for pro_project model
router.get("/pro_project", async (req, res) => {
  try {
    const projects = await prisma.pro_project.findMany();
    res.send({ success: true, projects });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch pro_project data" });
  }
});

// Route for pro_project_activity model
router.get("/pro_project_activity", async (req, res) => {
  try {
    const projectActivities = await prisma.pro_project_activity.findMany();
    res.send({ success: true, projectActivities });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        success: false,
        message: "Failed to fetch pro_project_activity data",
      });
  }
});

// Route for pro_task model
router.get("/pro_task", async (req, res) => {
  try {
    const tasks = await prisma.pro_task.findMany();
    res.send({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch pro_task data" });
  }
});

// Route for product model
router.get("/product", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.send({ success: true, products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch product data" });
  }
});

export default router;
