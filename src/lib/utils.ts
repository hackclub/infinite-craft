export const trim = (str: string, chars: string) =>
  str.split(chars).filter(Boolean).join(chars)
