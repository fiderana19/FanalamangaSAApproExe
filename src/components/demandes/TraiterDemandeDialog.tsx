import React, { useEffect } from "react";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTraiterDemande, TraiterDemandeAction } from "@/hooks/useTraiterDemande";
import { TraiterDemandeInterface } from "@/interfaces/Demande";
import { TraiterDemandeValidation } from "@/validation/demande.validation";

interface TraiterDemandeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demandeId: string;
  numeroDemande?: string;
  action: TraiterDemandeAction;
}

const CONFIG: Record<
  TraiterDemandeAction,
  { titre: string; description: string; label: string; icon: React.ReactNode }
> = {
  valider: {
    titre: "Valider la demande",
    description:
      "La demande sera transmise aux étapes suivantes du circuit d'approvisionnement.",
    label: "Valider",
    icon: <CheckCircleOutlined className="text-lg" />,
  },
  refuser: {
    titre: "Refuser la demande",
    description:
      "La demande sera refusée et le demandeur en sera informé. Le refus est définitif.",
    label: "Refuser",
    icon: <CloseCircleOutlined className="text-lg" />,
  },
};

const TraiterDemandeDialog: React.FC<TraiterDemandeDialogProps> = ({
  open,
  onOpenChange,
  demandeId,
  numeroDemande,
  action,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TraiterDemandeInterface>({
    resolver: yupResolver(TraiterDemandeValidation),
    defaultValues: { commentaireTraitementDemande: "" },
  });
  const { mutateAsync: traiter, isPending } = useTraiterDemande({ action });

  useEffect(() => {
    if (open) {
      reset({ commentaireTraitementDemande: "" });
    }
  }, [open, reset]);

  const config = CONFIG[action];

  const handleConfirm = async (values: TraiterDemandeInterface) => {
    const commentaire = values.commentaireTraitementDemande?.trim();
    try {
      await traiter({
        id: demandeId,
        data: commentaire ? { commentaireTraitementDemande: commentaire } : {},
      });
      onOpenChange(false);
    } catch {
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config.icon}
            {config.titre}
          </DialogTitle>
          <DialogDescription>
            {numeroDemande && (
              <span className="mr-1 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                {numeroDemande}
              </span>
            )}
            {config.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
          <div>
            <Label
              htmlFor="commentaireTraitementDemande"
              className="mb-1 block text-[13px] font-semibold"
            >
              Commentaire (facultatif)
            </Label>
            <Textarea
              id="commentaireTraitementDemande"
              rows={4}
              placeholder={
                action === "valider"
                  ? "Précisions sur la validation…"
                  : "Motif du refus…"
              }
              className={
                errors.commentaireTraitementDemande
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                  : undefined
              }
              {...control.register("commentaireTraitementDemande")}
            />
            {errors.commentaireTraitementDemande && (
              <div className="text-xs text-red-500 text-left w-full mt-1">
                {errors.commentaireTraitementDemande.message}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant={action === "valider" ? "brand" : "destructive"}
              disabled={isPending}
            >
              {isPending && <LoadingOutlined />}
              {isPending
                ? action === "valider"
                  ? "Validation…"
                  : "Refus…"
                : config.label}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TraiterDemandeDialog;
