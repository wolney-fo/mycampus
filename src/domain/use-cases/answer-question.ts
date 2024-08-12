import { Answer } from "../entities/answer";

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

interface AnswerQuestionUseCaseResponse {}

export class AnswerQuestionUseCase {
  execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer(content);

    return answer;
  }
}
