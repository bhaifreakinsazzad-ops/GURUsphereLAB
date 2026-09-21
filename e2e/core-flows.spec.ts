import { test, expect } from "@playwright/test";

test.describe("GURUsphere learner core flows", () => {
  test("public home and discovery routes load", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/GURU|sphere|Hadi/i);

    await page.goto("/discover");
    await expect(page).toHaveURL(/\/discover$/);
    await expect(page.locator("body")).toContainText(/Discover|course|Course/i);
  });

  test("sign-in form validates malformed input without submitting", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password").fill("x");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.locator("body")).toContainText(/valid email|check your details/i);
  });

  test("protected learning route redirects anonymous users to sign in", async ({ page }) => {
    await page.goto("/my-learning");
    await expect(page).toHaveURL(/\/login\?redirect=%2Fmy-learning/);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });

  test("course detail entry is reachable", async ({ page }) => {
    await page.goto("/courses/digital-essentials-2026");
    await expect(page).toHaveURL(/\/courses\/digital-essentials-2026$/);
    await expect(page.locator("body")).toContainText(/Enroll|Course not found|Loading course/i);
  });

  test("assessment route is protected for anonymous visitors", async ({ page }) => {
    await page.goto("/learn/8c0ff1b8-58d8-4a56-b495-94a86aeafdda/assessment/91dc73e8-2c99-44e1-b408-65f2f732da10");
    await expect(page).toHaveURL(/\/login\?redirect=%2Flearn%2F8c0ff1b8-58d8-4a56-b495-94a86aeafdda%2Fassessment%2F91dc73e8-2c99-44e1-b408-65f2f732da10/);
  });
});
