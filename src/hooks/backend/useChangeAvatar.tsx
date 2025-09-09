'use client';
import { useUIAppSelector } from "@/libs/redux/hooks";
// import { useState } from "react";

export default function useChangeAvatar() {
  // This hook is currently empty, but can be used to manage avatar change logic in the future.

  
  const avatar =  useUIAppSelector((state) => state.auth.profile.avatarUrl);
  //   const dispatch = useUIAppDispatch();

  const image = avatar || "/profile-placeholder.svg";

  const getImage = (file:File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        // setImage(reader.result as string);
        // dispatch(setAvatar(reader.result as string));
      }
    };
    reader.readAsDataURL(file);
  }

  return {
    // Placeholder for future functionality
    avatar:image,
    getImage
  };
}
