import express from "express";
import {PrismaClient} from '@prisma/client';


const tenderRouter = express.Router();
tenderRouter.use(express.json());
const prisma = new PrismaClient();


// Route for sfa_tender
tenderRouter.get("/sfa_tender", async (req, res) => {
    try {
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
            tender_value: false,
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
            exp_project_start:true,
            status: true,
            remarks: true,
            created_by: false,
            delete_id: true,
            deleted_by: true,
            loa_date: true,
        }
      });
      console.log(tenders);
      res.send({ success: true, tenders });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ success: false, message: "Failed to fetch sfa_tender data" });
    }
  });

  export default tenderRouter