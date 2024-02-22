function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

const storageToken = localStorage.getItem("token");
const cookieToken = getCookie("auth._token.keycloak");

import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

const applicationsWithToken = applications.map((app) => ({
  ...app,
  customProps: () => ({
    token: cookieToken,
  }),
}));

applicationsWithToken.forEach(registerApplication);
layoutEngine.activate();
start();
