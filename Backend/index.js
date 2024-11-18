import userRouter from "./routes/userRouter.js";
import targetRouter from "./routes/targetRouter.js";
import router from "./routes/mainRouts.js";
import express from "express";
import cors from "cors";
import tenderProgressRouter from "./routes/tenderProgressRouter.js";
import tenderRouter from "./routes/tenderRouter.js";
import clientRouter from "./routes/clientRouter.js";
import tenderTableRouter from "./routes/tenderTableRouter.js";
import chart2 from "./routes/chart2Router.js";
import funnelChart from "./routes/funnelRouter.js";
import wonIn2007To2024Router from "./routes/wonIn2007To2024Router.js";
import eventCalendar from "./routes/events.js";
import tenderStageTable from "./routes/TenderStageTablesRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/target", targetRouter);
app.use("/api", tenderProgressRouter);
app.use("/api", tenderRouter);
app.use("/api", router);
app.use("/api", clientRouter);
app.use("/api", tenderTableRouter);
app.use("/api", chart2);
app.use("/api", funnelChart);
app.use("/api", wonIn2007To2024Router);
app.use("/api", eventCalendar);
app.use("/api", tenderStageTable);

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
