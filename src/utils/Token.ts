export interface TokenPayloadInterface {
    id?: string;
    role?: string;
    exp?: number;
}

export const decoderToken = (
    token?: string | null,
): TokenPayloadInterface | null => {
    if (!token) {
        return null;
    }

    const base64Payload = token.split(".")[1];
    if (!base64Payload) {
        return null;
    }

    try {
        const payload = JSON.parse(atob(base64Payload));
        if (!payload || typeof payload !== "object") {
            return null;
        }
        return payload as TokenPayloadInterface;
    } catch {
        return null;
    }
};

export const isTokenValide = (token?: string | null): boolean => {
    const payload = decoderToken(token);
    if (!payload || typeof payload.exp !== "number") {
        return false;
    }
    return payload.exp * 1000 > Date.now();
};
