import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.sssupplement.com",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://www.sssupplement.com/privacy",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/about",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/terms",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/shipping",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/returns",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/contact",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/consumer-policy",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/faq",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/track-order",
      lastModified: new Date(),
      priority: 0.7,
    },
    {
      url: "https://www.sssupplement.com/chat-support",
      lastModified: new Date(),
      priority: 0.6,
    },
  ]
}
