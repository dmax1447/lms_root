import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import { getSavedUserToken } from "./helpers";
import { getCurrentUser } from "./api";
import nav from "./nav.json";
const token = getSavedUserToken();

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

getCurrentUser()
  .then((user) => {
    const applicationsWithCustomProps = applications.map((app) => ({
      ...app,
      customProps: () => ({
        token,
        user,
        nav,
      }),
    }));

    applicationsWithCustomProps.forEach(registerApplication);
    layoutEngine.activate();
    start();
  })
  .catch((err) => {
    console.warn("error");
  });
