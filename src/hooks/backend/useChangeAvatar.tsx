import { useUIAppSelector } from "@/libs/redux/hooks";
// import { useState } from "react";

export default function useChangeAvatar() {
  // This hook is currently empty, but can be used to manage avatar change logic in the future.
  const avatar = useUIAppSelector((state) => state.auth.profile.avatarUrl);
  //   const dispatch = useUIAppDispatch();

  return {
    // Placeholder for future functionality
    avatar,
  };
}
