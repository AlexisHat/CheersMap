import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        storage: createJSONStorage(() => AsyncStorage),
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
