import { UniqueEntityId } from "./unique-entity-id";

export class Entity<Props> {
  private _id: UniqueEntityId;
  protected props: any;

  get id(): UniqueEntityId {
    return this.id;
  }

  constructor(props: any, id?: string) {
    this.props = props;
    this._id = new UniqueEntityId(id);
  }
}
