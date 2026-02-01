import { test } from "@playwright/test";
import { PlumePage } from "@e2e/pages/PlumePage.ts";

test.describe("Navigation", () => {
  test("has index", async ({ page }) => {
    const indexPage = new PlumePage(page);
    await indexPage.toHome();

    await indexPage.hasTitle(/Hello there/);
  });

  [
    { pageName: "Home", title: "Hello there", url: "/" },
    { pageName: "Blog", title: "Blog", url: "/blog" },
    { pageName: "About", title: "About", url: "/about" },
    { pageName: "Now", title: "Now", url: "/now" },
  ].forEach(({ pageName, title, url }) => {
    test(`has ${pageName} page`, async ({ page }) => {
      const indexPage = new PlumePage(page);
      await indexPage.toHome();

      await indexPage.clickNavigation(pageName);
      await indexPage.hasUrl(url);
      await indexPage.hasTitle(title);
    });
  });
});
