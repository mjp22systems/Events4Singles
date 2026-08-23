type EventbriteUploadInstructions = {
  upload_token?: string;
  upload_url?: string;
  upload_data?: Record<string, string>;
  file_parameter_name?: string;
};

type EventbriteUploadComplete = {
  id?: string;
  error?: string;
  error_description?: string;
};

function filenameFromUrl(url: string, contentType: string): string {
  const pathname = new URL(url).pathname;
  const filename = pathname.split("/").filter(Boolean).pop();
  if (filename?.includes(".")) return filename;
  const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  return `event-image.${extension}`;
}

async function completeUpload(accessToken: string, uploadToken: string): Promise<EventbriteUploadComplete> {
  const jsonResponse = await fetch("https://www.eventbriteapi.com/v3/media/upload/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ upload_token: uploadToken }),
  });

  if (jsonResponse.ok) return jsonResponse.json() as Promise<EventbriteUploadComplete>;

  const formResponse = await fetch("https://www.eventbriteapi.com/v3/media/upload/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
    },
    body: new URLSearchParams({ upload_token: uploadToken }),
  });

  return formResponse.json() as Promise<EventbriteUploadComplete>;
}

export async function uploadEventbriteLogo(
  accessToken: string,
  imageUrl: string | null,
): Promise<{ logoId: string | null; warning?: string }> {
  if (!imageUrl) return { logoId: null };

  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) return { logoId: null, warning: `Image download failed: ${imageResponse.status}` };

    const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) return { logoId: null, warning: "Image URL did not return an image" };

    const instructionsResponse = await fetch(
      "https://www.eventbriteapi.com/v3/media/upload/?type=image-event-logo-preserve-quality",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!instructionsResponse.ok) {
      return { logoId: null, warning: `Eventbrite image upload setup failed: ${instructionsResponse.status}` };
    }

    const instructions = await instructionsResponse.json() as EventbriteUploadInstructions;
    if (!instructions.upload_url || !instructions.upload_token || !instructions.file_parameter_name) {
      return { logoId: null, warning: "Eventbrite image upload setup was incomplete" };
    }

    const form = new FormData();
    for (const [key, value] of Object.entries(instructions.upload_data ?? {})) {
      form.append(key, value);
    }
    const imageBlob = await imageResponse.blob();
    form.append(instructions.file_parameter_name, imageBlob, filenameFromUrl(imageUrl, contentType));

    const uploadResponse = await fetch(instructions.upload_url, {
      method: "POST",
      body: form,
    });
    if (!uploadResponse.ok) {
      return { logoId: null, warning: `Image upload failed: ${uploadResponse.status}` };
    }

    const complete = await completeUpload(accessToken, instructions.upload_token);
    if (!complete.id) {
      return { logoId: null, warning: complete.error_description ?? complete.error ?? "Eventbrite did not return an image ID" };
    }

    return { logoId: complete.id };
  } catch (error) {
    return {
      logoId: null,
      warning: error instanceof Error ? `Image upload failed: ${error.message}` : "Image upload failed",
    };
  }
}
