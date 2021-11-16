import { ClassConstructor } from "src/core/api";
import { Registry } from "../utils";

export interface ComponentOptions {
  template: string;
}

function Template<T>(classConstructor: ClassConstructor<T>) {
  return Registry.register(classConstructor, undefined, false)
}

@Template
export class TemplateRef {
  private templateElement: HTMLTemplateElement | null = null

  constructor(private readonly template: string) {}

  get templateEl(): DocumentFragment {
    if (this.templateElement === null) {
      this.templateElement = document.createElement('template');
      this.templateElement.innerHTML = this.template;
    }

    return (this.templateElement.cloneNode(true) as HTMLTemplateElement).content
  }
}

export interface Component<T = unknown> extends ClassConstructor<T> {
  init?: () => void
  render?: () => HTMLElement
}

/**
 * Class Decorator factory for a component
 * 
 * @param config 
 * @returns 
 */
export function Component(options: ComponentOptions) {
  let templateRef: TemplateRef | null

  /** 
   * @description helper function to add required methods if missing
   */
  function sanitize<T>(pageCtor: ClassConstructor<T>): ClassConstructor<T> {
    const prototype = pageCtor.prototype
    !prototype.init ? prototype.init = () => void 0 : void 0
    !prototype.render ? prototype.render = () => templateRef?.templateEl : void 0
    return pageCtor
  }

  /**
   * @description da class decorator
   */
  return function<T>(pageConstructor: ClassConstructor<T>): Component<T> {

    const injections = new Map() 
    templateRef = new TemplateRef(options.template)
    injections.set(TemplateRef, new TemplateRef(options.template))

    const pageCtor = sanitize(pageConstructor)
    return Registry.register(pageCtor, injections, false)
  }
}
