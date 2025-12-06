export type DriveFileInfo = {
  id: string;
  name: string;
};

const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3";
const UPLOAD_API_BASE = "https://www.googleapis.com/upload/drive/v3";

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  } as const;
}

export async function findAppDataFile(token: string, filename: string): Promise<DriveFileInfo | null> {
  const q = encodeURIComponent(`name='${filename}'`);
  const url = `${DRIVE_API_BASE}/files?q=${q}&spaces=appDataFolder&fields=files(id,name)`;
  const res = await fetch(url, { headers: authHeaders(token) });
  if (!res.ok) throw new Error(`Drive search failed: ${res.status}`);
  const data = await res.json();
  const file = (data.files?.[0]) || null;
  return file ? { id: file.id, name: file.name } : null;
}

export async function readJsonFile(token: string, fileId: string): Promise<any> {
  const url = `${DRIVE_API_BASE}/files/${fileId}?alt=media`;
  const res = await fetch(url, { headers: authHeaders(token) });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`Drive read failed: ${res.status}`);
  return res.json();
}

export async function createJsonFile(token: string, filename: string, json: any): Promise<DriveFileInfo> {
  const metadata = {
    name: filename,
    parents: ["appDataFolder"],
    mimeType: "application/json",
  };
  const body = JSON.stringify(json);

  const url = `${UPLOAD_API_BASE}/files?uploadType=multipart&fields=id,name`;
  const boundary = "boundary123";
  const multipartBody =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: application/json\r\n\r\n` +
    `${body}\r\n` +
    `--${boundary}--`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipartBody,
  });
  if (!res.ok) throw new Error(`Drive create failed: ${res.status}`);
  const data = await res.json();
  return { id: data.id, name: data.name };
}

export async function updateJsonFile(token: string, fileId: string, json: any): Promise<void> {
  const body = JSON.stringify(json);
  const url = `${UPLOAD_API_BASE}/files/${fileId}?uploadType=media`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body,
  });
  if (res.status === 401) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`Drive update failed: ${res.status}`);
}
