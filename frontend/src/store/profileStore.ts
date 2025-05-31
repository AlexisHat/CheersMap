import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface UserState {
  profilePicUrl: string | null;
  city: string | null;
  setProfilePicUrl: (url: string | null) => void;
  setMainCity: (city: string | null) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        profilePicUrl: null,
        city: null,
        setProfilePicUrl: (url) =>
          set(() => ({ profilePicUrl: url }), false, {
            type: "user/setProfilePicUrl",
            payload: url,
          }),
        setMainCity: (city) =>
          set(() => ({ city }), false, {
            type: "user/setMainCity",
            payload: city,
          }),
      }),
      {
        name: "user-store",
        version: 1,
        partialize: (state) => ({
          profilePicUrl: state.profilePicUrl,
          city: state.city,
        }),
        migrate: (persisted, version) => {
          return persisted as UserState;
        },
      }
    )
  )
);

export default useUserStore;
