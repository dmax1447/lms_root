import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import { getSavedUserToken } from "./helpers";
import { getCurrentUser, getServices } from "./api";
import { emitter } from "@lms/styleguide";
import { BehaviorSubject } from "rxjs";
import "../assets/styles/layout.css";

const token = getSavedUserToken();
const sidebarNav = new BehaviorSubject([]);

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});

emitter.on("app:set_nested_nav", ({ base, routes }) => {
  const nav = [...sidebarNav.value];
  const el = nav.find((v) => v.id === base);
  el.children = routes;
  sidebarNav.next(nav);
});

const layoutEngine = constructLayoutEngine({ routes, applications });

Promise.all([getCurrentUser(), getServices()])
  .then(([user, services]) => {
    sidebarNav.next(services);
    const applicationsWithCustomProps = applications.map((app) => ({
      ...app,
      customProps: () => ({ token, user, sidebarNav }),
    }));

    applicationsWithCustomProps.forEach(registerApplication);
    layoutEngine.activate();
    start();
  })
  .catch((err) => {
    console.warn("Error in init", err);
  });
