import { Component, TemplateRef } from "@app/core/decorators";
import { Todo } from "../api/todo";
import { TodoService } from "../utils/todo.service";

@Component({
  template: `
    <template data-list-item>
      <div data-list-item="name"></div>
    </template>
    <div data-todo-header>
      <button data-todo-action-add>add</button>
      <button data-todo-action-refresh>refresh</button>
    </div>
    <div data-list></div>
  `,
})
export class Home {
  private todos: Todo[] = []
  private listEl: HTMLElement | null = null
  private listItemTpl: HTMLTemplateElement | null = null

  constructor(
    private readonly todoService: TodoService,
    private readonly template: TemplateRef
  ) {}

  /**
   * @description page was called and will be initialized now
   */
  async init(): Promise<void> {
    this.todos = await this.todoService.list()
  }

  /**
   * @description render home page
   */
  render(): DocumentFragment {
    // fetch list item template and remove it from dom
    this.listItemTpl = this.template.templateEl.querySelector('[data-list-item]') as HTMLTemplateElement
    this.template.templateEl.removeChild(this.listItemTpl)

    this.renderTodoList()
    return this.template.templateEl
  }

  private renderTodoList() {
    this.listEl = this.template.templateEl.querySelector('[data-list]')

    console.log(this.todos)
    for (const todo of this.todos ?? []) {
      this.listEl?.appendChild(this.renderListItem(todo))
    }

    if (!this.listEl) {
      this.listEl = document.createElement(`div`)
      this.listEl.appendChild(document.createTextNode(`empty`))
    }
  }

  /**
   * @description render single list item
   * @returns 
   */
  private renderListItem(todo: Todo): DocumentFragment {
    if (!this.listItemTpl) {
      throw 'item template not found for list item'
    }

    const itemEl = (this.listItemTpl.cloneNode(true) as HTMLTemplateElement).content
    const name = itemEl.querySelector('[data-list-item="name"]')
    name ? name.innerHTML = todo.label : void 0 

    return itemEl
  }
}
