import QRCode from "qrcode";

export const genererQrDataUrl = async (texte: string): Promise<string> =>
    QRCode.toDataURL(texte, {
        errorCorrectionLevel: "M",
        width: 300,
        margin: 1,
    });
