"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  Leaf,
  Loader2,
  Upload,
} from "lucide-react";

import { AppNavbar } from "@/components/layout/app-navbar";
import {
  getToken,
  getLoggedInUser,
} from "@/lib/api/auth";
import { uploadScan } from "@/lib/api/services";

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scanId, setScanId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const token = getToken();

      if (!token) {
        window.location.href = "/login";
        return;
      }

      const user = await getLoggedInUser();

      if (!user) {
        window.location.href = "/login";
      }
    }

    checkAuth();
  }, []);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setError("");
    setSuccess(false);
    setScanId(null);

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }

  async function handleUpload() {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    const token = getToken();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess(false);

      const scan = await uploadScan(token, file);

      setScanId(scan.id);
      setSuccess(true);
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image.";

      setError(message);
    } finally {
      setUploading(false);
    }
  }

  function clearImage() {
    setFile(null);
    setPreview(null);
    setSuccess(false);
    setScanId(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-background">
      <AppNavbar />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"
        >
          <ArrowLeft size={17} />
          Back to dashboard
        </button>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <Leaf size={27} />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-foreground">
              Scan an item
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
              Upload a clear photo of a product or waste
              item. EcoLens will process it and build its
              sustainability information.
            </p>
          </div>

          <div className="mt-8">
            {!preview ? (
              <label className="group flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-background p-8 text-center transition hover:border-primary/50 hover:bg-primary-light/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-primary transition group-hover:scale-105">
                  <ImagePlus size={30} />
                </div>

                <h2 className="mt-5 font-bold text-foreground">
                  Upload an image
                </h2>

                <p className="mt-2 text-sm text-muted">
                  JPG, JPEG, PNG or WEBP · Maximum 10 MB
                </p>

                <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">
                  <Upload size={17} />
                  Choose image
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="overflow-hidden rounded-3xl border border-border bg-background">
                <div className="relative flex min-h-72 items-center justify-center p-4 sm:min-h-96">
                  <img
                    src={preview}
                    alt="Selected item"
                    className="max-h-96 max-w-full rounded-2xl object-contain"
                  />
                </div>

                <div className="border-t border-border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">
                        {file?.name}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        {file
                          ? `${(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)} MB`
                          : ""}
                      </p>
                    </div>

                    <button
                      onClick={clearImage}
                      className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-card hover:text-foreground"
                    >
                      Change image
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-light p-4">
              <CheckCircle2
                className="mt-0.5 shrink-0 text-primary"
                size={20}
              />

              <div>
                <p className="font-semibold text-foreground">
                  Image uploaded successfully
                </p>

                <p className="mt-1 text-sm text-muted">
                  Scan #{scanId} has been created and is
                  ready for AI processing.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading || success}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />
                Uploading...
              </>
            ) : (
              <>
                <Camera size={19} />
                Analyze this item
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-muted">
            For best results, use a well-lit image where
            the item and its label are clearly visible.
          </p>
        </section>
      </div>
    </main>
  );
}
