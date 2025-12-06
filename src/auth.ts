export type TokenRecord = {
  accessToken: string;
  expiry: number; // epoch ms
};

const TOKEN_KEY = 'google.drive.token.v1';
const FILE_ID_KEY = 'google.drive.fileId.v1';

export function loadToken(): TokenRecord | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as TokenRecord;
    if (!obj?.accessToken || !obj?.expiry) return null;
    if (Date.now() >= obj.expiry) return null;
    return obj;
  } catch {
    return null;
  }
}

export function saveToken(accessToken: string, expiresInSec = 3600) {
  try {
    const rec: TokenRecord = { accessToken, expiry: Date.now() + expiresInSec * 1000 };
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(rec));
  } catch {
    // ignore
  }
}

export function clearToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function loadFileId(): string {
  try {
    return sessionStorage.getItem(FILE_ID_KEY) || '';
  } catch {
    return '';
  }
}

export function saveFileId(id: string) {
  try {
    sessionStorage.setItem(FILE_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function clearFileId() {
  try {
    sessionStorage.removeItem(FILE_ID_KEY);
  } catch {
    // ignore
  }
}
