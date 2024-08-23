import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Question,
  QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

export function makeQuestion(override: Partial<QuestionProps> = {}): Question {
  const question = Question.create({
    authorId: new UniqueEntityId(),
    title: "New Question",
    slug: Slug.create("new-question"),
    content: "New question",
    ...override,
  });

  return question;
}
