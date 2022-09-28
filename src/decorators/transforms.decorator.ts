import { Transform } from 'class-transformer';

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns {(target: any, key: string) => void}
 * @constructor
 */
export function ToInt(): (target: any, key: string) => void {
  return Transform(({ value }) => parseInt(value, 10), { toClassOnly: true });
}
