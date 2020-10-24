import { Router } from "../../deps.ts";
import { getMainPage, getVisitorsBook, postVisitorEntry } from "./controller.ts";

const router = new Router();

router.get("/", getMainPage)
      .get("/visitors_book", getVisitorsBook)
      .post("/visitorEntry", postVisitorEntry)

export default router;
