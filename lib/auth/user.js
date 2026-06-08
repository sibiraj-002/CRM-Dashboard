export function getUserDisplayName(user) {
  if (!user) {
    return "User";
  }

  return user.displayName || user.email?.split("@")[0] || "User";
}

export function getUserInitials(user) {
  const name = getUserDisplayName(user);
  const parts = name.trim().split(/\s+/);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}
