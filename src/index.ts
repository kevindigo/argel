const worldName = 'world';

export function hello(world: string = worldName): string {
  return `Hello ${world}! `;
}
