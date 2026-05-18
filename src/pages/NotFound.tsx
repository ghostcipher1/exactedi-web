import { useLocation } from "react-router-dom";
import SEO from "@/components/SEO";

export default function NotFound() {
  const location = useLocation();

  return (
    <>
      <SEO
        title="Page Not Found — ExactEDI"
        description="The page you are looking for does not exist or has been moved."
        canonicalPath={location.pathname}
        noindex={true}
      />
      <div className="min-h-screen bg-stedi-dark flex flex-col items-center justify-center text-center px-4">
      <div className="relative z-10">
        <h1 className="text-6xl md:text-8xl font-bold text-stedi-green/20 select-none">
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-white mt-4">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-gray-400 font-mono">{location.pathname}</p>
        <p className="mt-6 text-sm text-gray-400">
          The page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 text-sm font-medium rounded-full bg-stedi-green text-white hover:bg-stedi-green-hover transition-colors"
        >
          <i className="ri-arrow-left-line text-xs" />
          Back to home
        </a>
      </div>
      </div>
    </>
  );
}