import { createContext, useContext } from "react";

export type User = {
  email: string;
};

export const UserContext = createContext<
  [User | null, React.Dispatch<React.SetStateAction<User | null>>]
>([null, () => {}]);

export function useUser() {
  const [user, setUser] = useContext(UserContext);

  return [user, setUser] as const;
}
