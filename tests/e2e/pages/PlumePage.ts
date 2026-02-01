import { expect, type Page } from "@playwright/test";
import { Pagination } from "@e2e/pages/Pagination.ts";

export class PlumePage {
  private readonly page: Page;

  public readonly pagination: Pagination;

  constructor(page: Page) {
    this.page = page;
    this.pagination = new Pagination(page);
  }

  async toHome() {
    await this.page.goto("/");
  }

  async to(path: string) {
    await this.page.goto(path);
  }

  async clickNavigation(name: string) {
    await this.page.getByRole("link", { name }).click();
  }

  async hasTitle(title: string | RegExp) {
    await expect(this.page).toHaveTitle(title);
  }

  async hasUrl(url: string) {
    await this.page.waitForURL(url);
  }

  async hasNavigation() {
    await expect(this.page.getByRole("navigation")).toBeVisible();
  }

  async hasHeadingLevel1() {
    await expect(this.page.getByRole("heading", { level: 1 })).toBeVisible();
  }

  async hasFooter() {
    await expect(this.page.getByRole("contentinfo")).toBeVisible();
  }

  async hasArticle(count: number) {
    expect(await this.page.getByRole("article").count()).toBe(count);
  }

  async clickOnLink(name: string) {
    await this.page.getByRole("link", { name }).click();
  }

  async hasStandardMeta() {
    const viewportMetaTag = this.page.locator("meta[name=viewport]");
    await expect(viewportMetaTag).toHaveAttribute(
      "content",
      "width=device-width",
    );

    const generatorMetaTag = this.page.locator("meta[name=generator]");
    await expect(generatorMetaTag).toHaveAttribute("content");

    const metaCharsetLocator = this.page.locator("meta[charset=UTF-8]");
    expect(metaCharsetLocator).toBeDefined();
  }

  async hasDefaultOpenGraphMetaTags() {
    const ogTitleMetaTagLocator = this.page.locator(
      'meta[property="og:title"]',
    );
    await expect(ogTitleMetaTagLocator).toHaveAttribute("content");

    const ogTypeMetaTag = this.page.locator('meta[property="og:type"]');
    await expect(ogTypeMetaTag).toHaveAttribute("content");

    const ogURLMetaTag = this.page.locator('meta[property="og:url"]');
    await expect(ogURLMetaTag).toHaveAttribute("content");

    const ogDescriptionMetaTag = this.page.locator(
      'meta[property="og:description"]',
    );
    await expect(ogDescriptionMetaTag).toHaveAttribute("content");
  }

  async hasTitleLevel(titlesNumber: number, level: number) {
    await expect(this.page.getByRole("heading", { level: level })).toHaveCount(
      titlesNumber,
    );
  }

  async hasToggleThemeButton() {
    expect(this.page.locator(".theme-switcher-button")).toBeDefined();
  }

  async allExternalLinksHaveNoReferrerAndExternal() {
    for (const link of await this.page.locator('a[href^="http"]').all()) {
      await expect(link).toHaveAttribute("rel", "noreferrer external");
    }
  }

  async hasAuthorInHeader() {
    const header = this.page.getByRole("banner");
    await expect(header).toBeVisible();
    await expect(header).toContainText("Your Name Here");
  }
}
