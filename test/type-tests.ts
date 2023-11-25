function f<T extends number | string | unknown>(a: T): T {
  if (typeof a === 'number') {
    return (a * 2) as T;
  }
  if (typeof a === 'string') {
    return (a + a) as T;
  }
  return a;
}

const a = f(1);
const b = f('123');
const c = f(null);

const prom = <T>(a: T): Promise<T> => Promise.resolve(a);
const packages1 = ['lsk', 'react', 'exe', 'exxxxx'];
const packages2 = ['lsk', 'react', 'exe', 'exxxxx'].map((a) => prom(a));
const packages3: Record<string, number> = {
  lsk: 1,
  react: 2,
  exe: 3,
  exxxxx: 4,
};

const main = async () => {
  const p1 = await map(packages1, async (item) => item.toUpperCase());
  const p2 = await map(packages1, (item) => item.toUpperCase());
  const p3 = await map(packages1, () => 123);
  const p4 = await map(packages1);

  const q1 = await map(packages2, async (item) => item.toUpperCase());
  const q2 = await map(packages2, (item) => item.toUpperCase());
  const q3 = await map(packages2, () => 123);
  const q4 = await map(packages2);

  const z1 = await props(packages3, async (item) => item * item);
  const z2 = await props(packages3, (item) => item * item);
  const z3 = await props(packages3, () => 'asdsa');
  const z4 = await props(packages3);

  return {
    p1,
    p2,
    p3,
    p4,
    q1,
    q2,
    q3,
    q4,
    z1,
    z2,
    z3,
    z4,
  };
};
