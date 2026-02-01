import { test } from "@playwright/test";
import { PlumePage } from "@e2e/pages/PlumePage.ts";

test.describe("Pages structure", () => {
  const pages = [
    { pageName: "Home", title: "Hello there", url: "/" },
    { pageName: "Blog", title: "Blog", url: "/blog" },
    { pageName: "About", title: "About", url: "/about" },
    { pageName: "Now", title: "Now", url: "/now" },
  ];

  pages.forEach(({ pageName, title, url }) => {
    test.describe(pageName, () => {
      let plumePage: PlumePage;

      test.beforeEach(async ({ page }) => {
        plumePage = new PlumePage(page);
        await plumePage.to(url);
      });

      test("has title", async () => {
        await plumePage.hasTitle(title);
      });

      test("has navigation", async () => {
        await plumePage.hasNavigation();
      });

      test("has h1", async () => {
        await plumePage.hasHeadingLevel1();
      });

      test("has footer", async () => {
        await plumePage.hasFooter();
      });

      test("has standard meta tags", async () => {
        await plumePage.hasStandardMeta();
      });

      test("has default Open Graph meta tags", async () => {
        await plumePage.hasDefaultOpenGraphMetaTags();
      });

      test("has one h1", async () => {
        await plumePage.hasTitleLevel(1, 1);
      });

      test("has one toggle theme button", async () => {
        await plumePage.hasToggleThemeButton();
      });

      test("has no referrer and external", async () => {
        await plumePage.allExternalLinksHaveNoReferrerAndExternal();
      });
    });
  });
});
