import { changeMyPassword } from "@/api/users";
import { ChangeMyPasswordInterface } from "@/interfaces/User";
import { TOAST_TYPE } from "@/constants/ToastType";
import { showToast } from "@/utils/Toast";
import { HttpStatus } from "@/constants/Http_status";
import { useMutation } from "@tanstack/react-query";

export const useChangeMyPassword = ({action}: {action?: () => void}) => {
    const mutation = useMutation({
        mutationFn: (data: ChangeMyPasswordInterface) => changeMyPassword(data),
        onSuccess: (response) => {
            if (
                response?.status === HttpStatus.OK ||
                response?.status === HttpStatus.CREATED
            ) {
                if (action) {
                    action();
                }
                showToast({
                    type: TOAST_TYPE.SUCCESS,
                    message: "Mot de passe mis à jour avec succès !"
                })
            }
        }
    })

    return mutation;
}