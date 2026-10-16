import { MOIS_LABELS_FR } from "@/constants/Dashboard";

export interface PointMois {
    label: string;
    valeur: number;
}

export interface DonutData {
    labels: string[];
    series: number[];
    colors: string[];
    total: number;
}

export interface BarresData {
    categories: string[];
    series: { name: string; data: number[] }[];
}

export const compterPar = <T>(
    items: T[],
    getKey: (item: T) => string | undefined | null
): Record<string, number> =>
    items.reduce<Record<string, number>>((acc, item) => {
        const key = getKey(item);
        if (!key) return acc;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

export const totalValeurs = (comptes: Record<string, number>) =>
    Object.values(comptes).reduce((acc, valeur) => acc + valeur, 0);

export const regrouperParMois = <T>(
    items: T[],
    getDate: (item: T) => string | undefined | null,
    nbMois = 6
): PointMois[] => {
    const maintenant = new Date();
    const buckets: { annee: number; mois: number; label: string; valeur: number }[] = [];

    for (let index = nbMois - 1; index >= 0; index--) {
        const date = new Date(maintenant.getFullYear(), maintenant.getMonth() - index, 1);
        buckets.push({
            annee: date.getFullYear(),
            mois: date.getMonth(),
            label: MOIS_LABELS_FR[date.getMonth()],
            valeur: 0,
        });
    }

    items.forEach((item) => {
        const brut = getDate(item);
        if (!brut) return;
        const date = new Date(brut);
        if (Number.isNaN(date.getTime())) return;
        const bucket = buckets.find(
            (element) => element.annee === date.getFullYear() && element.mois === date.getMonth()
        );
        if (bucket) bucket.valeur++;
    });

    return buckets.map((element) => ({ label: element.label, valeur: element.valeur }));
};

export const derniersParDate = <T>(
    items: T[],
    getDate: (item: T) => string | undefined | null,
    nombre: number
): T[] =>
    [...items]
        .sort((a, b) => {
            const dateA = new Date(getDate(a) ?? 0).getTime();
            const dateB = new Date(getDate(b) ?? 0).getTime();
            return dateB - dateA;
        })
        .slice(0, nombre);

export const construireDonut = (
    comptes: Record<string, number>,
    label: (key: string) => string,
    color: (key: string, index: number) => string
): DonutData => {
    const cles = Object.keys(comptes);
    return {
        labels: cles.map(label),
        series: cles.map((cle) => comptes[cle]),
        colors: cles.map((cle, index) => color(cle, index)),
        total: totalValeurs(comptes),
    };
};

export const construireBarres = (points: PointMois[], nom: string): BarresData => ({
    categories: points.map((point) => point.label),
    series: [{ name: nom, data: points.map((point) => point.valeur) }],
});
