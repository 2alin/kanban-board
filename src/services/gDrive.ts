const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

interface DriveFile {
  id: string;
  name: string;
}

interface DriveFileListResponse {
  files: DriveFile[];
}

function authHeader(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Find a gDrive file by its name.
 * @see {@link https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list | files.list API docs}
 *
 * @param token - The auth token
 * @param fileName - The name of the gDrive file to find
 * @returns the gDrive file ID that corresponds to the file name given or null if not found
 */
export async function findFile(
  token: string,
  fileName: string,
): Promise<string | null> {
  const params = new URLSearchParams({
    spaces: "appDataFolder",
    q: `name = '${fileName}'`,
    fields: "files(id, name)",
  });

  const res = await fetch(`${DRIVE_API}/files?${params}`, {
    headers: authHeader(token),
  });

  const data: DriveFileListResponse = await res.json();
  return data.files?.[0]?.id ?? null;
}

/**
 * Gets the content of a gDrive file
 * @see {@link https://developers.google.com/workspace/drive/api/reference/rest/v3/files/get | files.get API docs}
 *
 * @param token - The auth token
 * @param fileId - The ID of the gDrive file
 * @returns The gDrive file data
 */
export async function readFile<T>(
  token: string,
  fileId: string,
): Promise<T | null> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: authHeader(token),
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<T>;
}

/**
 * Gets the content of a gDrive file
 * @see {@link https://developers.google.com/workspace/drive/api/reference/rest/v3/files/create | files.create API docs}
 * @see {@link https://developers.google.com/workspace/drive/api/reference/rest/v3/files/update | files.update API docs}
 *
 * @param token - The auth token
 * @param fileName - The gDrive file name
 * @param data - Data to write in the gDrive file
 * @returns the id of the gDrive file where the data was written
 */
export async function writeFile<T>(
  token: string,
  fileName: string,
  data: T,
): Promise<string | null> {
  const existingId = await findFile(token, fileName);

  const metadata = {
    name: fileName,
    ...(!existingId && { parents: ["appDataFolder"] }), // only on create
  };

  const body = new FormData();
  body.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" }),
  );
  body.append(
    "media",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );

  const url = existingId
    ? `${UPLOAD_API}/files/${existingId}?uploadType=multipart` // PATCH = update
    : `${UPLOAD_API}/files?uploadType=multipart`; // POST  = create

  try {
    const res = await fetch(url, {
      method: existingId ? "PATCH" : "POST",
      headers: authHeader(token),
      body,
    });

    const file: DriveFile = await res.json();
    return file.id;
  } catch (err) {
    console.error(
      `[gDrive.write] Couldn't write data in gDrive for fileName ${fileName}`,
      err,
    );

    return null;
  }
}

/**
 * Deletes a gDrive file
 *
 * @param token - the auth token
 * @param fileId - the ID of the gDrive file to delete
 *
 * @returns whether the file was successfully deleted or not
 */
export async function deleteFile(
  token: string,
  fileId: string,
): Promise<boolean> {
  try {
    await fetch(`${DRIVE_API}/files/${fileId}`, {
      method: "DELETE",
      headers: authHeader(token),
    });

    return true;
  } catch (err) {
    console.error(`[gDrive.delete] Couldn't delete file in gDrive`, err);
    return false;
  }
}
