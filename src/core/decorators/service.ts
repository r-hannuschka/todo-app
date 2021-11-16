import { ClassConstructor } from "../api";
import { Registry } from "../utils";

export function Service<T>(classConstructor: ClassConstructor<T>) {
  return Registry.register(classConstructor)
}
