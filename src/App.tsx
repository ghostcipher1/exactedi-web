import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import AnalyticsListener from "./components/AnalyticsListener";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AnalyticsListener />
        <AppRoutes />
        <Analytics />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
