import { Router } from "../../deps.ts";
import { getMainPage } from "../controllers/mainPage.controller.ts";
import { getPrivacyPolicy } from "../controllers/privacyPolicy.controller.ts";
import { getVisitorsBook, postVisitorEntry } from '../controllers/visitorsBook.controller.ts';
import { PageInformation } from "../utils/constants.ts";

const router = new Router();

router.get(PageInformation.MainPage.GetRoute, getMainPage)
      .get(PageInformation.VisitorsBook.GetRoute, getVisitorsBook)
      .post(PageInformation.VisitorsBook.PostRoute, postVisitorEntry)
      .get(PageInformation.PrivacyPolicy.GetRoute, getPrivacyPolicy);

export default router;
