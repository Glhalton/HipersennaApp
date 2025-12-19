import { userDataStore } from "@/store/userDataStore";

type PermissionWrapperProps = {
  children: React.ReactNode;
  requiredPermission?: number;
  requiredPermissions?: number[];
  requiredRole?: number;
  mode?: "ALL" | "ANY";
};

export function PermissionWrapper({
  children,
  requiredPermission,
  requiredPermissions,
  requiredRole,
  mode = "ALL",
}: PermissionWrapperProps) {
  const permissionIds = userDataStore((state) => state.user.allPermissions);
  const role = userDataStore((state) => state.user.role.role_id);

  const neededPermissions = requiredPermissions ?? (requiredPermission ? [requiredPermission] : []);

  const hasPermissions =
    neededPermissions.length === 0
      ? true
      : mode === "ANY"
        ? neededPermissions.some((p) => permissionIds.includes(p))
        : neededPermissions.every((p) => permissionIds.includes(p));

  const hasRole = requiredRole ? role === requiredRole : true;

  if (!hasPermissions || !hasRole) {
    return null;
  }
  return <>{children}</>;
}
