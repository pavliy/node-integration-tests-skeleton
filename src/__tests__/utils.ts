export function ByPassDecorator<T>(): any {
  return (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): unknown => {
    const originalMethod = descriptor.value;
    descriptor.value = async function descriptorValue(
      this: T,
      ...args: readonly any[]
    ): Promise<unknown> {
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
