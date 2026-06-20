export class DecimalUtils {
  static toFixed2(value: number): string {
    return value.toFixed(2);
  }

  static parseDecimal(value: string | number): number {
    return typeof value === 'string' ? parseFloat(value) : value;
  }

  static add(a: string | number, b: string | number): number {
    return this.parseDecimal(a) + this.parseDecimal(b);
  }

  static subtract(a: string | number, b: string | number): number {
    return this.parseDecimal(a) - this.parseDecimal(b);
  }

  static multiply(a: string | number, b: string | number): number {
    return this.parseDecimal(a) * this.parseDecimal(b);
  }

  static lessThan(a: string | number, b: string | number): boolean {
    return this.parseDecimal(a) < this.parseDecimal(b);
  }

  static greaterThan(a: string | number, b: string | number): boolean {
    return this.parseDecimal(a) > this.parseDecimal(b);
  }

  static equals(a: string | number, b: string | number): boolean {
    return this.parseDecimal(a) === this.parseDecimal(b);
  }
}
