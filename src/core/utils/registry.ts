import { ClassConstructor } from "../api";

declare type InjectionToken<T = unknown> = ClassConstructor<T>
declare type InjectorMap = Map<InjectionToken, any>

export class Registry {

  private static readonly registry = new Map<Object, any>()

  /** 
   * @description register a token
   */
  static register<T>(token: InjectionToken<T>, injectors?: InjectorMap, singleton = true): ClassConstructor<T> {
    const newClassConstructor = this.createClassConstructorWithDependencies<T>(token, injectors)
    this.registry.set(token, { ctor: newClassConstructor, instance: null, singleton })
    return newClassConstructor
  }

  /**
   * @description resolve existing class and lazy creation if no instance exists
   */
  static resolve<T>(token: ClassConstructor<T>): T {
    const key = Reflect.getMetadata('__originalClassConstructor__', token) ?? token
    const entry = this.registry.get(key)

    if (!entry.singleton) {
      console.log('this is no singleton why you do this with me')
      return new entry.ctor()
    }

    if (!entry.instance)  {
      entry.instance = new entry.ctor()
    } 

    return entry.instance
  }

  /**
   * factory to create a class constructor and inject dependencies
   * 
   * @param target 
   * @returns 
   */
  private static createClassConstructorWithDependencies<T>(
    target: ClassConstructor<T>,
    injects?: InjectorMap
  ): ClassConstructor<T> {
    const params = Reflect.getMetadata("design:paramtypes", target)
    const deps: unknown[] = params?.map((dep: ClassConstructor) => {
      const token = Reflect.getMetadata('__originalClassConstructor__', dep) ?? dep
      const dependency = injects?.get(token) ?? this.resolve(token)
      if (!dependency) {
        console.error(`Dependency not found for:`, dep)
      }
      return dependency
    })

    /** new class constructor */
    const newPageConstructor = function() {
      return new target(...deps || [])
    } as unknown as ClassConstructor<T>
    newPageConstructor.prototype = target.prototype

    /** as we override the class constructor, save the original inside the metadata */
    Reflect.defineMetadata('__originalClassConstructor__', target, newPageConstructor)

    return newPageConstructor
  }
}
