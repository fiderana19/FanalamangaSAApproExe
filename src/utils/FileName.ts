export const sanitizeFileName = (value: string, fallback = "document") => {
  const cleaned = value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^[.\s-]+|[.\s-]+$/g, "");

  return cleaned || fallback;
};
