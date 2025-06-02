import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/authTypes";

export interface UserState {
  user: User | null;
  profilePicUrl: string | null;
  city: string | null;
  setUser: (user: User | null) => void;
  setProfilePicUrl: (url: string | null) => void;
  setMainCity: (city: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        profilePicUrl: null,
        city: null,

        setUser: (user) =>
          set(
            () => ({
              user,
              profilePicUrl: user?.profilePicUrl ?? null,
              city: user?.city ?? null,
            }),
            false,
            {
              type: "user/setUser",
              payload: user,
            }
          ),

        setProfilePicUrl: (url) =>
          set(
            (state) => ({
              profilePicUrl: url,
              user: state.user ? { ...state.user, profilePicUrl: url } : null,
            }),
            false,
            {
              type: "user/setProfilePicUrl",
              payload: url,
            }
          ),

        setMainCity: (city) =>
          set(
            (state) => ({
              city,
              user: state.user ? { ...state.user, city } : null,
            }),
            false,
            {
              type: "user/setMainCity",
              payload: city,
            }
          ),

        clearUser: () =>
          set(
            () => ({
              user: null,
              profilePicUrl: null,
              city: null,
            }),
            false,
            {
              type: "user/clearUser",
            }
          ),
      }),
      {
        name: "user-store",
        version: 2,
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          user: state.user,
          profilePicUrl: state.profilePicUrl,
          city: state.city,
        }),
        migrate: (persisted, version) => persisted as UserState,
      }
    )
  )
);
