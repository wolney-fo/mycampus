import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { describe, it } from "vitest";
import { EditAnswerUseCase } from "./edit-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-id-1") },
      new UniqueEntityId("answer-id-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: "author-id-1",
      answerId: newAnswer.id.toValue(),
      content: "New content",
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "New content",
    });
  });

  it("should not be able to edit an inexistent answer", async () => {
    await expect(() =>
      sut.execute({
        authorId: "author-id-1",
        answerId: "inexistent-answer-id",
        content: "New content",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to edit a answer from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-id-1") },
      new UniqueEntityId("answer-id-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await expect(() =>
      sut.execute({
        authorId: "author-id-2",
        answerId: newAnswer.id.toValue(),
        content: "New content",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
