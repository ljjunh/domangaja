export const typography = {
  t1: { fontSize: 30, lineHeight: 40 },
  t2: { fontSize: 26, lineHeight: 35 },
  t3: { fontSize: 22, lineHeight: 31 },
  t4: { fontSize: 20, lineHeight: 29 },
  t5: { fontSize: 17, lineHeight: 25.5 },
  t6: { fontSize: 15, lineHeight: 22.5 },
  t7: { fontSize: 13, lineHeight: 19.5 },
  st1: { fontSize: 29, lineHeight: 38 },
  st2: { fontSize: 28, lineHeight: 37 },
  st3: { fontSize: 27, lineHeight: 36 },
  st4: { fontSize: 25, lineHeight: 34 },
  st5: { fontSize: 24, lineHeight: 33 },
  st6: { fontSize: 23, lineHeight: 32 },
  st7: { fontSize: 21, lineHeight: 30 },
  st8: { fontSize: 19, lineHeight: 28 },
  st9: { fontSize: 18, lineHeight: 27 },
  st10: { fontSize: 16, lineHeight: 24 },
  st11: { fontSize: 14, lineHeight: 21 },
  st12: { fontSize: 12, lineHeight: 18 },
  st13: { fontSize: 11, lineHeight: 16.5 },
} as const;

export type TypographyKey = keyof typeof typography;
