import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import RoadmapPage from "../pages/roadmap/page";
import RequestAccessPage from "../pages/request-access/page";
import PricingPage from "../pages/pricing/page";
import SecurityPage from "../pages/security/page";
import DevDocsPage from "../pages/dev-docs/page";
import BlogPage from "../pages/blog/page";
import BlogArticlePage from "../pages/blog/article/page";
import UseCasePage from "../pages/use-cases/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/roadmap",
    element: <RoadmapPage />,
  },
  {
    path: "/request-access",
    element: <RequestAccessPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/security",
    element: <SecurityPage />,
  },
  {
    path: "/dev-docs",
    element: <DevDocsPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/blog/:slug",
    element: <BlogArticlePage />,
  },
  {
    path: "/use-cases/:slug",
    element: <UseCasePage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;