import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ShieldCheck,
  UserRound,
  Mail,
  CalendarDays,
  Save,
  RotateCcw,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
  Crown,
  LockKeyhole,
  Camera,
  X,
} from "lucide-react";

import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

// Adjust these TWO imports to the same dashboard backgrounds you already use.
import desktopBackground from "../../../assets/DashboardImages/GoldenTempleProfile.png";
import mobileBackground from "../../../assets/DashboardImages/TemplePhoneprofile.png";

const clampWhole = (value, min, max) =>
  Number.isInteger(Number(value)) &&
  String(value).trim() !== "" &&
  Number(value) >= min &&
  Number(value) <= max;

export default function Profile() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [spiritual, setSpiritual] = useState("32");
  const [overall, setOverall] = useState("40");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [avatarSourceIndex, setAvatarSourceIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedPhoto) {
      setPhotoPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedPhoto);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedPhoto]);

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoFeedback({
        type: "error",
        message: "Choose a JPG, PNG, or WebP image.",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoFeedback({
        type: "error",
        message: "The image must be 5 MB or smaller.",
      });
      return;
    }
    setPhotoFeedback(null);
    setSelectedPhoto(file);
  }

  async function savePhoto() {
    if (!selectedPhoto || uploadingPhoto) return;
    setUploadingPhoto(true);
    setPhotoFeedback(null);
    try {
      const body = new FormData();
      body.append("image", selectedPhoto);
      // Do not manually set Content-Type: the browser adds the multipart boundary.
      await axiosSecure.patch("/users/me/profile-picture", body, {
        headers: { "Content-Type": undefined },
      });
      await queryClient.invalidateQueries({ queryKey: ["profile", user?.uid] });
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setSelectedPhoto(null);
      setPhotoFeedback({
        type: "success",
        message: "Profile picture updated.",
      });
    } catch (error) {
      setPhotoFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Unable to upload picture. Please try again.",
      });
    } finally {
      setUploadingPhoto(false);
    }
  }

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile", user?.uid],
    enabled: Boolean(user?.uid),
    queryFn: async () => (await axiosSecure.get("/users/me")).data,
    staleTime: 30_000,
  });

  const isOwner = profile?.role === "owner";
  const savedSpiritual = profile?.safetyLine?.spiritual ?? 32;
  const savedOverall = profile?.safetyLine?.overall ?? 40;

  useEffect(() => {
    if (!profile) return;
    setSpiritual(String(savedSpiritual));
    setOverall(String(savedOverall));
    setFeedback(null);
  }, [profile, savedSpiritual, savedOverall]);

  const validSpiritual = clampWhole(spiritual, 32, 38);
  const validOverall = !isOwner || clampWhole(overall, 40, 48);
  const changed =
    Number(spiritual) !== savedSpiritual ||
    (isOwner && Number(overall) !== savedOverall);

  async function handleSave(event) {
    event.preventDefault();
    if (!validSpiritual || !validOverall || !changed || saving) return;
    setSaving(true);
    setFeedback(null);
    try {
      const payload = { spiritual: Number(spiritual) };
      if (isOwner) payload.overall = Number(overall);
      await axiosSecure.patch("/users/me/safety-line", payload);
      await queryClient.invalidateQueries({ queryKey: ["profile", user?.uid] });
      await queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      setFeedback({
        type: "success",
        message: "Your safety line preferences were saved successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Could not save your preferences. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setSpiritual(String(savedSpiritual));
    setOverall(String(savedOverall));
    setFeedback(null);
  }

  const displayName =
    profile?.displayName?.trim() || user?.displayName?.trim() || "Omkar Member";
  // Prefer the Firebase photo if MongoDB has no photo; try both if one fails.
  const avatarSources = [
    ...new Set([profile?.photoURL, user?.photoURL].filter(Boolean)),
  ];
  const avatarUrl = avatarSources[avatarSourceIndex] || null;

  useEffect(() => {
    setAvatarSourceIndex(0);
  }, [profile?.photoURL, user?.photoURL]);
  const joinDate = profile?.registeredAt
    ? new Date(profile.registeredAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-[#160d0d] text-[#fbeac9]">
      <picture className="pointer-events-none absolute inset-0">
        <source media="(max-width: 767px)" srcSet={mobileBackground} />
        <img
          src={desktopBackground}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </picture>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#14090b]/65 via-[#230d12]/70 to-[#14090b]/85" />

      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col justify-center px-3 py-2 sm:px-5 sm:py-3 lg:px-7">
        <header className="mb-3 shrink-0 text-center max-[height:700px]:mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e8bb70]">
            Omkar Quest
          </p>
          <h1 className="font-serif text-xl font-semibold text-[#ffe5a7] sm:text-2xl lg:text-3xl mb-10">
            My Profile
          </h1>
        </header>

        {isLoading ? (
          <div className="flex min-h-0 flex-1 items-center justify-center gap-2">
            <LoaderCircle className="h-5 w-5 animate-spin" /> Loading profile...
          </div>
        ) : isError ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3">
            <p>Unable to load your profile.</p>
            <button
              onClick={() => refetch()}
              className="rounded-lg border border-[#f0c67d]/50 px-4 py-2"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid min-h-0 w-full content-center items-start gap-3 md:items-stretch md:grid-cols-[0.9fr_1.1fr] md:gap-4">
            <section className="min-w-0 rounded-2xl border border-[#f4cc83]/30 bg-[#281317]/85 p-3 shadow-[0_12px_36px_rgba(0,0,0,.25)] backdrop-blur-lg sm:p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 md:flex-col md:text-center">
                  <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px]">
                    <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#f4cd82] bg-gradient-to-br from-[#a26946] to-[#4b232c] flex items-center justify-center">
                      {photoPreview || avatarUrl ? (
                        <img
                          key={photoPreview || avatarUrl}
                          src={photoPreview || avatarUrl}
                          alt={`${displayName}'s profile`}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                          onError={() => {
                            if (!photoPreview)
                              setAvatarSourceIndex((index) => index + 1);
                          }}
                        />
                      ) : (
                        <UserRound
                          aria-label="Default profile icon"
                          className="h-6 w-6 text-[#ffe4a6] sm:h-8 sm:w-8 lg:h-9 lg:w-9"
                          strokeWidth={1.6}
                        />
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={selectPhoto}
                      aria-label="Choose profile picture"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      aria-label="Change profile picture"
                      title="Change profile picture"
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#f4cd82] bg-[#54212a] text-[#ffe5ac] shadow-md transition hover:bg-[#71313c] disabled:opacity-50"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-serif text-base font-semibold text-[#ffe5b0] sm:text-lg lg:text-xl">
                      {displayName}
                    </h2>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#f3d18e]/30 bg-[#f3d18e]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#f8d68d]">
                      {isOwner ? (
                        <Crown className="h-3 w-3" />
                      ) : (
                        <UserRound className="h-3 w-3" />
                      )}
                      {isOwner ? "Owner" : "Member"}
                    </span>
                  </div>
                </div>
                {selectedPhoto && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 md:justify-center">
                    <button
                      type="button"
                      onClick={savePhoto}
                      disabled={uploadingPhoto}
                      className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#e8b966] to-[#ffe3a0] px-3 py-1.5 text-xs font-semibold text-[#3e1e1b] disabled:opacity-50"
                    >
                      {uploadingPhoto ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      {uploadingPhoto ? "Uploading..." : "Save picture"}
                    </button>
                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      onClick={() => setSelectedPhoto(null)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#e9c68d]/35 px-2 py-1.5 text-xs text-[#f4d9ac] disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" /> Cancel
                    </button>
                  </div>
                )}
                {photoFeedback && (
                  <p
                    role="status"
                    className={`mt-1 text-center text-[11px] ${photoFeedback.type === "error" ? "text-red-200" : "text-emerald-200"}`}
                  >
                    {photoFeedback.message}
                  </p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-1.5 border-t border-[#e8c78a]/20 pt-2 sm:mt-3 md:grid-cols-1 md:gap-2 md:pt-3">
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={profile?.email || user?.email || "Not available"}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label="Joined"
                    value={joinDate}
                  />
                  <InfoRow
                    icon={LockKeyhole}
                    label="Account"
                    value="Firebase secured"
                  />
                </div>
              </div>
            </section>

            <section className="flex min-w-0 flex-col rounded-2xl border border-[#f4cc83]/30 bg-[#281317]/85 p-3 shadow-[0_12px_36px_rgba(0,0,0,.25)] backdrop-blur-lg sm:p-4">
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                <div className="">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#f6d28a]" />
                    <h2 className="font-serif text-base font-semibold text-[#ffe5b0] sm:text-lg lg:text-xl">
                      Safety Line Preferences
                    </h2>
                  </div>
                  <p className="mt-1 text-[10px] leading-tight text-[#f5ddba]/70 sm:text-xs">
                    Choose the minimum score shown on your progress charts. Past
                    scores never change.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-[360px]:grid-cols-1 md:grid-cols-1 lg:gap-3">
                  <SafetyField
                    label="Spiritual Safety Line"
                    value={spiritual}
                    onChange={setSpiritual}
                    min={32}
                    max={38}
                    total={38}
                    invalid={!validSpiritual}
                  />
                  {isOwner && (
                    <SafetyField
                      label="Overall Safety Line"
                      value={overall}
                      onChange={setOverall}
                      min={40}
                      max={48}
                      total={48}
                      invalid={!validOverall}
                    />
                  )}
                </div>
                <div className="shrink-0">
                  {feedback && (
                    <p
                      role="status"
                      className={`mb-1 flex items-center gap-1 text-[11px] ${feedback.type === "success" ? "text-emerald-200" : "text-red-200"}`}
                    >
                      {feedback.type === "success" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      )}
                      {feedback.message}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={!changed || saving}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#e9c68d]/35 px-2 py-2 text-xs text-[#f4d9ac] disabled:opacity-40"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Reset
                    </button>
                    <button
                      type="submit"
                      disabled={
                        !validSpiritual || !validOverall || !changed || saving
                      }
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-[#e8b966] via-[#ffe3a0] to-[#d9a753] px-2 py-2 text-xs font-bold text-[#3e1e1b] disabled:opacity-45"
                    >
                      {saving ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      {saving ? "Saving..." : "Save preferences"}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#f0d099]/10 bg-white/[0.035] px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-[#e7bd78]" />
      <span className="hidden shrink-0 text-[10px] uppercase text-[#edcfaa]/60 sm:inline">
        {label}:
      </span>
      <span
        className="min-w-0 truncate text-xs text-[#fff0d0]"
        title={String(value)}
      >
        {value}
      </span>
    </div>
  );
}

function SafetyField({ label, value, onChange, min, max, total, invalid }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#f1d09b]/20 bg-[#12090c]/35 px-2.5 py-2 sm:px-3 sm:py-3">
      <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-[11px] font-semibold leading-tight text-[#ffe4ac] sm:text-sm">
          {label}
        </label>
        <span className="text-[10px] text-[#e9cda6]/70">
          Allowed: {min}–{max}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={invalid}
          className={`h-9 w-16 min-w-0 rounded-lg border bg-[#fff7e9] px-2 text-center text-lg font-bold text-[#532b28] outline-none focus:ring-2 focus:ring-[#f5ce82] ${invalid ? "border-red-400" : "border-[#e3bc75]"}`}
        />
        <span className="whitespace-nowrap font-serif text-lg text-[#f8dba7]">
          / {total}
        </span>
        {invalid && (
          <span className="ml-auto text-[10px] text-red-200">
            Enter {min}–{max}
          </span>
        )}
      </div>
    </div>
  );
}
