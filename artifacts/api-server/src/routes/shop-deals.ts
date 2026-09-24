import { Router, type IRouter } from "express";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const configuredPartnerApiBase = process.env["PARTNER_API_BASE_URL"]?.trim();
let partnerApiBase = configuredPartnerApiBase || "https://api.diyala-app.com/api";
while (partnerApiBase.endsWith("/")) partnerApiBase = partnerApiBase.slice(0, -1);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isShopDeal(value: unknown): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  return typeof value["id"] === "string" &&
    typeof value["title"] === "string" &&
    typeof value["conditions"] === "string" &&
    (value["discountType"] === "percent" || value["discountType"] === "amount") &&
    typeof value["discountValue"] === "number" &&
    typeof value["shopName"] === "string" &&
    typeof value["shopLocationId"] === "string" &&
    typeof value["shopImageUrl"] === "string" &&
    typeof value["code"] === "string" &&
    value["status"] === "active" &&
    typeof value["createdAt"] === "string" &&
    typeof value["expiresAt"] === "string";
}

router.get("/shop-deals", async (_req, res) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const upstream = await fetch(partnerApiBase + "/shop-deals", {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!upstream.ok) {
      logger.error({ status: upstream.status }, "Shop offers upstream returned non-success");
      res.status(502).json({ error: "تعذّر تحميل عروض المحلات" });
      return;
    }

    const payload: unknown = await upstream.json();
    if (!isRecord(payload) || !Array.isArray(payload["deals"]) || !payload["deals"].every(isShopDeal)) {
      logger.error("Shop offers upstream returned an invalid response");
      res.status(502).json({ error: "تعذّر تحميل عروض المحلات" });
      return;
    }

    res.setHeader("Cache-Control", "public, max-age=15");
    res.json({ deals: payload["deals"] });
  } catch (err) {
    logger.error({ err }, "GET /shop-deals proxy failed");
    res.status(502).json({ error: "تعذّر تحميل عروض المحلات" });
  } finally {
    clearTimeout(timeout);
  }
});

export default router;
