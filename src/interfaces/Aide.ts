import { type LucideIcon } from "lucide-react";

export interface AideAction {
    titre: string;
    description: string;
    etapes: string[];
    astuce?: string;
}

export interface AideSection {
    id: string;
    titre: string;
    icone: LucideIcon;
    intro: string;
    actions: AideAction[];
}
