import { Registry } from '.';
import { ClassConstructor } from '../api';
import { Component, Service } from '../decorators'

/**
 * @description rxjs next generation
 */
class EventContainer<T> {
  private subscribers: Array<(value: T) => void> = []

  emit(value: T) {
    for (const subscriber of this.subscribers) {
      subscriber(value)
    }
  }

  subscribe(subscriber: (value: T) => void) {
    this.subscribers.push(subscriber)

    /** unsubscribe */
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber)
    }
  }
}

export interface Route {
  path: string
  component: Component<any>
}

@Service
export class Router {
  private readonly routes = new Map()
  private event$ = new EventContainer<ClassConstructor>()

  /**
   * @description register route
   */
  registerRoute(route: Route | Route[]) {
    const routes = Array.isArray(route) ? route : [route]
    for (let route of routes) {
      this.routes.set(route.path, route.component)
    }
  }

  /**
   * @description navigate to specific route
   */
  async navigate(path: string) {
    const component = this.routes.get(path)
    if (component) {
      this.event$.emit(Registry.resolve(component))
    }
  }

  /**
   * @description returns stream we can register on
   */
  change() {
    return this.event$;
  }
}
