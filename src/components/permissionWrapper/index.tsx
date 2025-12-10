import { userDataStore } from "@/store/userDataStore";

type PermissionWrapperProps = {
  children: React.ReactNode;
  requiredPermission?: number;
  requiredPermissions?: number[];
  requiredRole?: number;
};

export function PermissionWrapper({
  children,
  requiredPermission,
  requiredPermissions,
  requiredRole,
}: PermissionWrapperProps) {
  const permissions = userDataStore((state) => state.user.hsusers_permissions);
  const role = userDataStore((state) => state.user.role_id);

  const permissionIds = permissions.map((p) => p.permission_id);

  const neededPermissions = requiredPermissions ?? (requiredPermission ? [requiredPermission] : []);

  const hasPermissions =
    neededPermissions.length === 0
      ? true
      : neededPermissions.every((p) => permissionIds.includes(p));

  const hasRole = requiredRole ? role === requiredRole : true;

  if (!hasPermissions || !hasRole) {
    return null;
  }
  return <>{children}</>;
}
