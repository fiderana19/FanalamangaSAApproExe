import React, { useCallback, useEffect, useRef, useState } from "react";
import { QrCode, CircleX } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/utils/Toast";
import { TOAST_TYPE } from "@/constants/ToastType";
import { useGetLivraisonsParSortie } from "@/hooks/useGetLivraisonsParSortie";
import { LivraisonInterface } from "@/interfaces/Livraison";

const REGION_ID = "livraison-qr-region";

const LivraisonScanPage: React.FC = () => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const chainRef = useRef<Promise<void>>(Promise.resolve());
  const traiteRef = useRef<boolean>(false);
  const onDecodeRef = useRef<(texte: string) => void>(() => {});
  const [sortieId, setSortieId] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  onDecodeRef.current = (texte: string) => {
    if (traiteRef.current) {
      return;
    }
    traiteRef.current = true;
    setSortieId(texte.trim());
  };

  useEffect(() => {
    let cancelled = false;
    const scanner = new Html5Qrcode(REGION_ID, { verbose: false });
    scannerRef.current = scanner;

    const demarrer = async () => {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (texte) => {
            if (!cancelled) {
              onDecodeRef.current(texte);
            }
          },
          () => {},
        );
      } catch {
        if (!cancelled) {
          setCameraError(
            "Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur.",
          );
        }
      }
    };

    const arreter = async () => {
      try {
        await scanner.stop();
      } catch {
        /* le scanner n'était pas (encore) démarré */
      }
      try {
        scanner.clear();
      } catch {
        /* ignore */
      }
    };

    chainRef.current = chainRef.current.then(demarrer).catch(() => {});

    return () => {
      cancelled = true;
      chainRef.current = chainRef.current.then(arreter).catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  const reinitialiser = useCallback((message: string) => {
    showToast({ type: TOAST_TYPE.ERROR, message });
    traiteRef.current = false;
    setSortieId(null);
  }, []);

  const { data: livraisons, isLoading, isError } =
    useGetLivraisonsParSortie(sortieId ?? undefined);

  useEffect(() => {
    if (!sortieId) {
      return;
    }
    if (isError) {
      reinitialiser("Le bon de sortie scanné est invalide ou introuvable.");
      return;
    }
    if (isLoading) {
      return;
    }
    const liste = (livraisons ?? []) as LivraisonInterface[];
    const recevables = liste
      .filter((l) => l.statutLivraison === "en_cours" && !l.reception)
      .sort(
        (a, b) =>
          new Date(b.dateCreationLivraison).getTime() -
          new Date(a.dateCreationLivraison).getTime(),
      );
    const cible = recevables[0];
    if (!cible) {
      reinitialiser(
        liste.length === 0
          ? "Aucune livraison n'est associée à ce bon de sortie."
          : "Aucune livraison de ce bon de sortie n'est à réceptionner.",
      );
      return;
    }
    navigate(`/employe/livraison/reception/${cible._id}`, { replace: true });
  }, [sortieId, livraisons, isLoading, isError, navigate, reinitialiser]);

  return (
    <div className='flex flex-col gap-5 pb-14'>
      <div className='w-full panel p-5 flex items-center gap-5'>
        <div className='grid place-items-center size-14 rounded-lg bg-sky-50 text-sky-600 shrink-0'>
          <QrCode className='w-7 h-7' />
        </div>
        <div className='flex flex-1 flex-col justify-center gap-1 min-w-0'>
          <h1 className='text-lg font-bold truncate'>Scanner un bon de sortie</h1>
          <p className='text-sm text-muted-foreground'>
            Placez le QR code du bon de sortie devant la caméra pour ouvrir la
            réception correspondante.
          </p>
        </div>
      </div>

      <div className='panel rounded-lg p-5'>
        {cameraError ? (
          <div className='flex flex-col items-center justify-center gap-3 py-10 text-center'>
            <div className='grid place-items-center size-12 rounded-lg bg-red-50 text-red-600'>
              <CircleX className='w-6 h-6' />
            </div>
            <p className='text-sm text-gray-600'>{cameraError}</p>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <div
              id={REGION_ID}
              className='w-full max-w-md overflow-hidden rounded-lg bg-black'
            />
            <p className='text-sm text-muted-foreground'>
              {sortieId
                ? "Bon de sortie détecté, ouverture de la réception…"
                : "En attente d'un QR code…"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivraisonScanPage;
