export const typography = {
  t1: { fontSize: 30, lineHeight: 40 },
  t2: { fontSize: 26, lineHeight: 35 },
  t3: { fontSize: 22, lineHeight: 31 },
  t4: { fontSize: 20, lineHeight: 29 },
  t5: { fontSize: 17, lineHeight: 25.5 },
  t6: { fontSize: 15, lineHeight: 22.5 },
  t7: { fontSize: 13, lineHeight: 19.5 },
  st12: { fontSize: 12, lineHeight: 18 },
} as const;

export type TypographyKey = keyof typeof typography;
