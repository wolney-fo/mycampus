import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { describe, it } from "vitest";
import { EditQuestionUseCase } from "./edit-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-id-1") },
      new UniqueEntityId("question-id-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      authorId: "author-id-1",
      questionId: newQuestion.id.toValue(),
      title: "New title",
      content: "New content",
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "New title",
      content: "New content",
    });
  });

  it("should not be able to edit an inexistent question", async () => {
    await expect(() =>
      sut.execute({
        authorId: "author-id-1",
        questionId: "inexistent-question-id",
        title: "New title",
        content: "New content",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityId("author-id-1") },
      new UniqueEntityId("question-id-1")
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    await expect(() =>
      sut.execute({
        authorId: "author-id-2",
        questionId: newQuestion.id.toValue(),
        title: "New title",
        content: "New content",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
