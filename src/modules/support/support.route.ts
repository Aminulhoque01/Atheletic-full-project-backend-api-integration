import e, { Router } from "express";
import { SupportController } from "./support.controller";

const route = Router();

route.post('/post', SupportController.postSupport);
route.get('/get-mail', SupportController.getEmail);

export const SupportRoutes = route;