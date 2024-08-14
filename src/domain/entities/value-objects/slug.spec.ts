import { describe, expect, it } from "vitest";
import { Slug } from "./slug";

describe("Slug Value Object", () => {
  it("should be able to create a new slug from text", async () => {
    const slug = Slug.createFromText("Example question title");

    expect(slug.value).toEqual("example-question-title");
  });
});
