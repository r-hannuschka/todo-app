import { Service } from "@app/core/decorators";
import { Todo } from "../api/todo";

@Service
export class TodoService {

  private items: Todo[] = []

  list(): Promise<Todo[]>  {
    return import('../data/todos.json').then((data) => data.default.items as unknown as Todo[])
  }

  async add(item: Todo): Promise<Todo[]> {
    this.items.push(item)
    return this.items
  }

  async remove(item: Todo): Promise<Todo[]> {
    this.items = this.items.filter((todo) => todo !== item)
    return this.items
  }
}
