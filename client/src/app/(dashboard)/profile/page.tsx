"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Copy,
  Lock,
  Pencil,
  User as UserIcon,
} from "lucide-react";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { getPasswordStrength } from "@/lib/passwordStrength";
import { FormErrorBanner } from "@/components/ui/FormErrorBanner";
import { getErrorMessage } from "@/lib/errors";
import {
  updatePasswordSchema,
  updateProfileSchema,
  type UpdatePasswordFormValues,
  type UpdateProfileFormValues,
} from "@/lib/validators";
import {
  cn,
  formatLastSeen,
  formatMemberSince,
} from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProfileCard({
  title,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-border dark:bg-bg-surface">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-indigo-600 dark:text-primary-500" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-text-primary">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password);
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700",
              segment <= strength.segments && strength.colorClass
            )}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500 dark:text-text-muted">
        {password ? strength.label : "Enter a password"}
      </p>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth();
  const { isLoading, updateProfile, updatePassword } = useProfile();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const profileForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const passwordForm = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = passwordForm.watch("newPassword") ?? "";

  useEffect(() => {
    if (user?.name) {
      profileForm.reset({ name: user.name });
    }
  }, [user?.name, profileForm]);

  if (!user) {
    return null;
  }

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      appToast.success("Account ID copied");
      window.setTimeout(() => setCopiedId(false), 2000);
    } catch {
      appToast.error("Could not copy to clipboard");
    }
  };

  const onSaveProfile = async (values: UpdateProfileFormValues) => {
    setProfileError(null);
    try {
      const data = await updateProfile(values);
      if (data.data?.user) {
        updateUser(data.data.user);
      }
      setIsEditingProfile(false);
      appToast.success("Profile saved");
    } catch (err) {
      setProfileError(getErrorMessage(err));
    }
  };

  const onSavePassword = async (values: UpdatePasswordFormValues) => {
    try {
      await updatePassword(values);
      passwordForm.reset();
      appToast.success("Password updated successfully");
    } catch (err) {
      const message = getErrorMessage(err);
      if (message.toLowerCase().includes("current password")) {
        passwordForm.setError("currentPassword", {
          message: "Current password is incorrect",
        });
      } else {
        passwordForm.setError("root", { message });
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-text-primary">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">
          Manage your account details and security.
        </p>
      </header>

      <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-border dark:bg-bg-surface sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white">
          {getInitials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-text-primary">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-text-muted">
            {user.email}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            {user.createdAt && (
              <span className="text-sm text-slate-600 dark:text-text-secondary">
                Member since {formatMemberSince(user.createdAt)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-700/20 dark:text-success-500">
              <span className="h-2 w-2 rounded-full bg-success-500" />
              Active
            </span>
          </div>
        </div>
      </div>

      <ProfileCard
        title="Personal Information"
        icon={UserIcon}
        action={
          !isEditingProfile ? (
            <button
              type="button"
              onClick={() => setIsEditingProfile(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-text-secondary dark:hover:bg-bg-elevated"
              aria-label="Edit profile"
            >
              <Pencil className="h-4 w-4" />
            </button>
          ) : null
        }
      >
        {isEditingProfile ? (
          <form
            onSubmit={profileForm.handleSubmit(onSaveProfile)}
            className="space-y-4"
          >
            <Input
              label="Name"
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register("name")}
            />
            <div className="flex w-full flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-text-primary">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  disabled
                  title="Email cannot be changed"
                  className="h-11 w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-50 px-3 pr-10 text-sm text-slate-500 dark:border-border dark:bg-bg-elevated dark:text-text-muted"
                />
                <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-text-muted">
                Email cannot be changed
              </p>
            </div>
            <FormErrorBanner message={profileError} />
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full sm:flex-1"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:flex-1"
                onClick={() => {
                  setIsEditingProfile(false);
                  profileForm.reset({ name: user.name });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                Name
              </dt>
              <dd className="mt-1 text-sm text-slate-800 dark:text-text-primary">
                {user.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                Email
              </dt>
              <dd className="mt-1 text-sm text-slate-500 dark:text-text-muted">
                {user.email}
              </dd>
            </div>
          </dl>
        )}
      </ProfileCard>

      <ProfileCard title="Change Password" icon={Lock}>
        <form
          onSubmit={passwordForm.handleSubmit(onSavePassword)}
          className="space-y-4"
        >
          <PasswordInput
            label="Current Password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register("currentPassword")}
          />
          <div className="space-y-2">
            <PasswordInput
              label="New Password"
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register("newPassword")}
            />
            <PasswordStrengthBar password={newPasswordValue} />
          </div>
          <PasswordInput
            label="Confirm Password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register("confirmPassword")}
          />
          <FormErrorBanner message={passwordForm.formState.errors.root?.message} />
          <Button type="submit" isLoading={isLoading} className="w-full">
            Update Password
          </Button>
        </form>
      </ProfileCard>

      <ProfileCard title="Account Information" icon={UserIcon}>
        <dl className="space-y-4">
          <div>
            <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Account ID
            </dt>
            <dd className="mt-1 flex items-center gap-2">
              <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-800 dark:bg-bg-elevated dark:text-text-primary">
                {user.id}
              </code>
              <button
                type="button"
                onClick={() => void handleCopyId()}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:hover:bg-bg-elevated"
                aria-label="Copy account ID"
              >
                {copiedId ? (
                  <Check className="h-4 w-4 text-success-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </dd>
          </div>
          {user.createdAt && (
            <div>
              <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                Member since
              </dt>
              <dd className="mt-1 text-sm text-slate-800 dark:text-text-primary">
                {formatMemberSince(user.createdAt)}
              </dd>
            </div>
          )}
          {user.updatedAt && (
            <div>
              <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                Last seen
              </dt>
              <dd className="mt-1 text-sm text-slate-800 dark:text-text-primary">
                {formatLastSeen(user.updatedAt)}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
              Account status
            </dt>
            <dd className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-700/20 dark:text-success-500">
                <span className="h-2 w-2 rounded-full bg-success-500" />
                Active
              </span>
            </dd>
          </div>
        </dl>
      </ProfileCard>
    </div>
  );
}
