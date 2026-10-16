export const pluriel = (n: number, singulier: string, pluriel?: string) =>
    n > 1 ? (pluriel ?? `${singulier}s`) : singulier;

export const suffixeS = (n: number) => (n > 1 ? "s" : "");
