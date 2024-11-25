import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const noticeRouter = express.Router();

noticeRouter.get("/notice", async (req, res) => {
  const notice = await prisma.sfa_notice.findMany();

  return res.json({
    tenderName: notice.tender_name,
    id_sfa_subm_method: notice.id_sfa_subm_method,
  });
});

// Route to fetch notices with deadlines >= current date
noticeRouter.get("/notices", async (req, res) => {
  try {
    const currentDate = new Date();

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
        const submissionMethod = await prisma.sfa_submission_methods.findUnique(
          {
            where: { id: notice.id_sfa_subm_method },
          }
        );

        const submissionType = await prisma.sfa_submission_types.findUnique({
          where: { id: notice.id_sfa_subm_type },
        });

        const salesPerson = await prisma.adm_profiles.findUnique({
          where: { id: notice.id_adm_profileSP },
        });

        const preSales = await prisma.adm_profiles.findUnique({
          where: { id: notice.id_adm_profilePS },
        });

        const salesAdmin = await prisma.adm_profiles.findUnique({
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

    res.json({ success: true, notices: formattedNotices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notices" });
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
        const submissionMethod = await prisma.sfa_submission_methods.findUnique(
          {
            where: { id: notice.id_sfa_subm_method },
          }
        );

        const submissionType = await prisma.sfa_submission_types.findUnique({
          where: { id: notice.id_sfa_subm_type },
        });

        const salesPerson = await prisma.adm_profiles.findUnique({
          where: { id: notice.id_adm_profileSP },
        });

        const preSales = await prisma.adm_profiles.findUnique({
          where: { id: notice.id_adm_profilePS },
        });

        const salesAdmin = await prisma.adm_profiles.findUnique({
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
