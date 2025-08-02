import { useUIAppSelector } from "@/libs/redux/hooks";

export default function useDashboardAvatar() {
  // Hook logic here
  const profileSelector = useUIAppSelector((state) => state.auth.profile);
  const avatarUrl = profileSelector.avatarUrl || '/path/to/default/avatar.png';
  const name = profileSelector.name || 'Guest';
  const email = profileSelector.email || 'guest@example.com';
  return{
    avatarUrl,
    name,
    email,
  }
}
