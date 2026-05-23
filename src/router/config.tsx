import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import RoadmapPage from "../pages/roadmap/page";
import RequestAccessPage from "../pages/request-access/page";
import PricingPage from "../pages/pricing/page";
import SecurityPage from "../pages/security/page";
import ProductPage from "../pages/product/page";
import DevDocsLayout from "../pages/dev-docs/components/DevDocsLayout";
import DocPage from "../pages/dev-docs/DocPage";
import BlogPage from "../pages/blog/page";
import BlogArticlePage from "../pages/blog/article/page";
import UseCasePage from "../pages/use-cases/page";
import { devDocPages } from "../lib/dev-docs/config";

const devDocChildRoutes: RouteObject[] = [
  { index: true, element: <DocPage /> },
  ...devDocPages
    .filter((page) => page.id !== "getting-started")
    .map((page) => ({
      path: page.path.replace(/^\/dev-docs\/?/, ""),
      element: <DocPage />,
    })),
];

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
    path: "/product",
    element: <ProductPage />,
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
    element: <DevDocsLayout />,
    children: devDocChildRoutes,
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
