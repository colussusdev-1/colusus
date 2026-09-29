import publicRoutes from "./routes/public.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { startBlogScheduler } from "./scheduler.js";

export { publicRoutes, adminRoutes, startBlogScheduler };
