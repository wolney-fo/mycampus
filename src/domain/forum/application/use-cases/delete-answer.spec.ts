import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { describe, it } from "vitest";
import { DeleteAnswerUseCase } from "./delete-answer";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: DeleteAnswerUseCase;

describe("Delete Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-id-1") },
      new UniqueEntityId("answer-id-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: "author-id-1",
      answerId: "answer-id-1",
    });

    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it("should not be able to delete an inexistent answer", async () => {
    await expect(() =>
      sut.execute({
        authorId: "author-id-1",
        answerId: "inexistent-answer-id",
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should not be able to delete a answer from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityId("author-id-1") },
      new UniqueEntityId("answer-id-1")
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await expect(() =>
      sut.execute({
        authorId: "author-id-2",
        answerId: "answer-id-1",
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
