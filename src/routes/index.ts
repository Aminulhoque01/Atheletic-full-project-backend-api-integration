import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { TermsRoutes } from "../modules/Terms/Terms.route";
import { AboutRoutes } from "../modules/About/About.route";
import { PrivacyRoutes } from "../modules/privacy/Privacy.route";
// import { NotificationRoutes } from "../modules/notifications/notification.route";
import { promoCodeRoutes } from "../modules/promoCode/promoCode.route";
import { feedBackRoutes } from "../modules/Feedback/feedback.route";
import { subscriptionRoutes } from "../modules/subscription/subscription.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { EventRoutes } from "../modules/event/event.route";
// import { AthleticRoutes } from "../modules/athletic/athletic.router";
import { ListingRoutes } from "../modules/listing/listing.router";
import { FighterRoutes } from "../modules/fighter-registion-event/fighter.router";
import { ParticipantRouter } from "../modules/participant/participant.router";
import { CategoryRoutes } from "../modules/category/category.router";
import { EventRequestRoutes } from "../modules/eventRequest/eventRequest.route";
import { SupportRoutes } from "../modules/support/support.route";
import { withdrawRouter } from "../modules/withdraw-request/withdraw.router";
import { NotificationRoutes } from "../modules/notifications/notification.route";
import { JudgmentRoutes } from "../modules/judgment/judgment.router";
import { MatchRoutes } from "../modules/match/match.route";



const router = express.Router();

// router.use("/api/v1/user", UserRoutes);
// router.use("/api/v1/terms", TermsRoutes);
// router.use("/api/v1/about", AboutRoutes);
// router.use("/api/v1/privacy", PrivacyRoutes);
// router.use("/api/v1/notification", NotificationRoutes);
// router.use("/api/v1/cupon-code", promoCodeRoutes);
// router.use("/api/v1/feedback", feedBackRoutes);
// router.use("/api/v1/subscription", subscriptionRoutes);
// router.use("/api/v1/purchase", paymentRoutes);
// router.use("/api/v1/event", EventRoutes);

const apiRoutes = [
  {
    path: "/auth",
    route: UserRoutes,
  },
  {
    path: "/fighter",
    route: FighterRoutes,
  },
  {
    path: "/event",
    route: EventRoutes,
  },
  {
    path: "/eventRequest",
    route: EventRequestRoutes,
  },
  {
    path: "/withdraw",
    route: withdrawRouter,
  },

  {
    path: "/listing",
    route: ListingRoutes,
  },
  {
    path: "/participant",
    route: ParticipantRouter,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/terms",
    route: TermsRoutes,
  },
  {
    path: "/judgment",
    route: JudgmentRoutes,
  },
  {
    path: "/match",
    route: MatchRoutes,
  },
  {
    path: "/about",
    route: AboutRoutes,
  },
  {
    path: "/privacy",
    route: PrivacyRoutes,
  },
  {
    path: "/support",
    route: SupportRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/cupon-code",
    route: promoCodeRoutes,
  },
  {
    path: "/subscription",
    route: subscriptionRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },

  {
    path: "/feedback",
    route: feedBackRoutes,
  },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
