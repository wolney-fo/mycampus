import { describe, expect, it } from "vitest";
import { AnswerQuestionUseCase } from "./answer-question";
import { AnswersRepository } from "../repositories/answers-repository";
import { Answer } from "../entities/answer";

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return;
  },
};

describe("Create Answer Use Case", () => {
  it("should create an answer", async () => {
    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository);

    const answer = await answerQuestion.execute({
      instructorId: "1",
      questionId: "1",
      content: "Nova resposta",
    });

    expect(answer.content).toEqual("Nova resposta");
  });
});
