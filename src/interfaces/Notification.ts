export interface NotificationInterface {
    _id: string;
    titre: string;
    message: string;
    typeNotification: string;
    utilisateur: string;
    dateEnvoie: string;
    estLu: boolean;
}
