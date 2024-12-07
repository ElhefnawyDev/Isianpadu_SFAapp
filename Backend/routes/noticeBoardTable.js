import express from "express";
import { PrismaClient } from "@prisma/client";
import authenticateToken from "../middleware/auth.js";

const prisma = new PrismaClient();
const noticeRouter = express.Router();
noticeRouter.get("/notices", authenticateToken, async (req, res) => {
  try {
    const currentDate = new Date();

    // Fetch all notices that match the criteria
    const notices = await prisma.sfa_tender.findMany({
      where: {
        display_notice_id: true,
        delete_id: 0,
        deadline: {
          gte: currentDate,
        },
      },
      orderBy: {
        deadline: "asc",
      },
      select: {
        tender_id: true,
        tender_shortname: true,
        id_sfa_subm_method: true,
        id_sfa_subm_type: true,
        brief_date: true,
        deadline: true,
        id_adm_profileSP: true,
        id_adm_profilePS: true,
        id_adm_profileSA: true,
        remarks: true,
      },
    });

    // Fetch related data in batches
    const submissionMethods = await prisma.sfa_subm_method.findMany();
    const submissionTypes = await prisma.sfa_subm_type.findMany();
    const profiles = await prisma.adm_profile.findMany();
    const salesTeams = await prisma.sfa_salesteam.findMany();

    // Create lookups for related data
    const methodLookup = submissionMethods.reduce(
      (acc, method) => ({ ...acc, [method.id]: method.method_name }),
      {}
    );

    const typeLookup = submissionTypes.reduce(
      (acc, type) => ({ ...acc, [type.id]: type.type_name }),
      {}
    );

    const profileLookup = profiles.reduce(
      (acc, profile) => ({ ...acc, [profile.id]: profile.name }),
      {}
    );

    const salesTeamLookup = salesTeams.reduce(
      (acc, team) => ({ ...acc, [team.staff_id]: team.name }),
      {}
    );

    // Format notices
    const formattedNotices = notices.map((notice, index) => ({
      no: index + 1,
      tenderName: notice.tender_shortname,
      submissionMethod: methodLookup[notice.id_sfa_subm_method] || "N/A",
      submissionType: typeLookup[notice.id_sfa_subm_type] || "N/A",
      briefDate: notice.brief_date
        ? new Date(notice.brief_date).toLocaleDateString("en-GB")
        : "No briefing",
      deadline: notice.deadline
        ? new Date(notice.deadline).toLocaleDateString("en-GB")
        : "N/A",
      salesPerson: salesTeamLookup[notice.id_adm_profileSP] || "N/A", // Fetch sales team for sales person
      preSales: profileLookup[notice.id_adm_profilePS] || "N/A",
      salesAdmin: profileLookup[notice.id_adm_profileSA] || "N/A",
      remarks: notice.remarks || "N/A",
    }));

    // Send response
    res.json({ success: true, notices: formattedNotices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notices" });
  }
});


// Route to fetch notice history (deadlines < current date)
noticeRouter.get("/notice-history", async (req, res) => {
  try {
    const currentDate = new Date();

    const notices = await prisma.sfa_tender.findMany({
      where: {
        display_notice_id: true,
        delete_id: 0,
        deadline: {
          lt: currentDate,
        },
      },
      orderBy: {
        deadline: "desc",
      },
      select: {
        tender_shortname: true,
        id_sfa_subm_method: true,
        id_sfa_subm_type: true,
        brief_date: true,
        deadline: true,
        id_adm_profileSP: true,
        id_adm_profilePS: true,
        id_adm_profileSA: true,
        remarks: true,
      },
    });

    const formattedNotices = await Promise.all(
      notices.map(async (notice, index) => {
        const submissionMethod = await prisma.sfa_subm_method.findUnique(
          {
            where: { id: notice.id_sfa_subm_method },
          }
        );

        const submissionType = await prisma.sfa_subm_type.findUnique({
          where: { id: notice.id_sfa_subm_type },
        });

        const salesPerson = await prisma.adm_profile.findUnique({
          where: { id: notice.id_adm_profileSP },
        });

        const preSales = await prisma.adm_profile.findUnique({
          where: { id: notice.id_adm_profilePS },
        });

        const salesAdmin = await prisma.adm_profile.findUnique({
          where: { id: notice.id_adm_profileSA },
        });

        return {
          no: index + 1,
          tenderName: notice.tender_shortname,
          submissionMethod: submissionMethod?.method_name || "N/A",
          submissionType: submissionType?.type_name || "N/A",
          briefDate: notice.brief_date
            ? new Date(notice.brief_date).toLocaleDateString()
            : "No briefing",
          deadline: new Date(notice.deadline).toLocaleDateString(),
          salesPerson: salesPerson?.name || "N/A",
          preSales: preSales?.name || "N/A",
          salesAdmin: salesAdmin?.name || "N/A",
          remarks: notice.remarks || "N/A",
        };
      })
    );

    res.json({ success: true, noticeHistory: formattedNotices });
  } catch (error) {
    console.error("Error fetching notice history:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notice history" });
  }
});

export default noticeRouter;
