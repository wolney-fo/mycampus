import { describe, it } from "vitest";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Question } from "../../enterprise/entities/question";
import { CreateQuestionUseCase } from "./create-question";

const fakeQuestionsRepository: QuestionsRepository = {
  create: async (question: Question) => {},
};

describe("Create Question Use Case", () => {
  it("should create a question", async () => {
    const createQuestion = new CreateQuestionUseCase(fakeQuestionsRepository);

    const { question } = await createQuestion.execute({
      authorId: "1",
      title: "New question",
      content: "Question content",
    });

    expect(question.id).toBeTruthy();
  });
});
