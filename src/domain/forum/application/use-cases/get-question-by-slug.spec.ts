import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { describe, it } from "vitest";
import { Question } from "../../enterprise/entities/question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get Question by Slug Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const newQuestion = Question.create({
      authorId: new UniqueEntityId(),
      title: "New Question",
      slug: Slug.create("new-question"),
      content: "New question",
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const { question } = await sut.execute({
      slug: "new-question",
    });

    expect(question.id).toBeTruthy();
    expect(question.title).toEqual("New Question");
  });

  it("should not be able to get a question by slug", async () => {
    await expect(() =>
      sut.execute({ slug: "uncreated-question" })
    ).rejects.toBeInstanceOf(Error);
  });
});
