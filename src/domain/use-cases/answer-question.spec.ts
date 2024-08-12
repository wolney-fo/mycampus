import { describe, expect, it } from "vitest";
import { AnswerQuestionUseCase } from "./answer-question";

describe("Create Answer Use Case", () => {
  it("should create an answer", () => {
    const answerQuestion = new AnswerQuestionUseCase();

    const answer = answerQuestion.execute({
      instructorId: "1",
      questionId: "1",
      content: "Nova resposta",
    });

    expect(answer.content).toEqual("Nova resposta");
  });
});
