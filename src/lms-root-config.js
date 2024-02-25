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
import { routes as courseRoutes } from "@lms/courses";
console.log("root:course_routes", courseRoutes);
console.log("root:import_course_routes");
import("@lms/courses").then((module) => {
  console.log("root:import_course_routes", module);
});

const token = getSavedUserToken();

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

console.log("root:applications", applications);

const layoutEngine = constructLayoutEngine({ routes, applications });
Promise.allSettled(
  applications.map((app) => {
    return System.import(app.name);
  })
).then((results) => {
  console.log("root:import_results", results);
  const appRoutes = results
    .filter((result) => result.status === "fulfilled" && result.value.appRoutes)
    .map((r) => r.value);
  console.log("root:modules_with_appRoutes", appRoutes);
});

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
