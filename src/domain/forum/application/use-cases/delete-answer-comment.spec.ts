import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { describe, it } from "vitest";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete Answer Comment Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to delete a answer comment", async () => {
    const answerComment = makeAnswerComment();

    await inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    });

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete another user answer comment", async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityId("author-1"),
    });

    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      authorId: "author-2",
      answerCommentId: answerComment.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
