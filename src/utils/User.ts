export const getInitials = (nom: string, prenom?: string) =>
  `${nom?.[0] ?? ""}${prenom?.[0] ?? ""}`.toUpperCase();

export const getUserDisplayName = (user: any) =>
  `${user.nom ?? ""} ${user.prenom ?? ""}`.trim().toLowerCase();