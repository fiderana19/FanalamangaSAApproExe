import React, { useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { XCircle } from "lucide-react";
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
import { useAnnulerApprovisionnement } from "@/hooks/useAnnulerApprovisionnement";
import { AnnulerApprovisionnementInterface } from "@/interfaces/Approvisionnement";
import { AnnulerApprovisionnementValidation } from "@/validation/approvisionnement.validation";

interface AnnulerApprovisionnementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  approvisionnementId: string;
  numeroApprovisionnement?: string;
}

const AnnulerApprovisionnementDialog: React.FC<
  AnnulerApprovisionnementDialogProps
> = ({ open, onOpenChange, approvisionnementId, numeroApprovisionnement }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AnnulerApprovisionnementInterface>({
    resolver: yupResolver(AnnulerApprovisionnementValidation),
    defaultValues: { commentaireAnnulation: "" },
  });
  const { mutateAsync: annuler, isPending } = useAnnulerApprovisionnement();

  useEffect(() => {
    if (open) {
      reset({ commentaireAnnulation: "" });
    }
  }, [open, reset]);

  const handleConfirm = async (values: AnnulerApprovisionnementInterface) => {
    const commentaire = values.commentaireAnnulation?.trim();
    try {
      await annuler({
        id: approvisionnementId,
        data: commentaire ? { commentaireAnnulation: commentaire } : {},
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
            <XCircle className="text-lg text-red-500" />
            Annuler l'approvisionnement
          </DialogTitle>
          <DialogDescription>
            {numeroApprovisionnement && (
              <span className="mr-1 inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                {numeroApprovisionnement}
              </span>
            )}
            L'approvisionnement ainsi que son bon de magasin associé seront
            annulés. Cette action est définitive.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleConfirm)} className="space-y-4">
          <div>
            <Label
              htmlFor="commentaireAnnulation"
              className="mb-1 block text-[13px] font-semibold"
            >
              Commentaire (facultatif)
            </Label>
            <Textarea
              id="commentaireAnnulation"
              rows={4}
              placeholder="Motif de l'annulation…"
              className={
                errors.commentaireAnnulation
                  ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20"
                  : undefined
              }
              {...control.register("commentaireAnnulation")}
            />
            {errors.commentaireAnnulation && (
              <div className="text-xs text-red-500 text-left w-full mt-1">
                {errors.commentaireAnnulation.message}
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
              Ne pas annuler
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
            >
              {isPending && <LoadingOutlined />}
              {isPending ? "Annulation…" : "Annuler l'approvisionnement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnnulerApprovisionnementDialog;
