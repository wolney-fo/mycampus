import { randomUUID } from "node:crypto";

export class Entity<Props> {
  private _id: string;
  protected props: any;

  get id(): string {
    return this.id;
  }

  constructor(props: any, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }
}
