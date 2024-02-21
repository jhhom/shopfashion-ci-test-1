import { createContext, useContext,  } from "react";

export type AfterVerifyTokenNavigation = {
  to: string;
};

export const AfterVerifyTokenNavigationContext = createContext<
  [
    AfterVerifyTokenNavigation | null,
    React.Dispatch<React.SetStateAction<AfterVerifyTokenNavigation | null>>,
  ]
>([null, () => {}]);

export function useAfterVerifyTokenNavigation() {
  const [nav, setNav] = useContext(AfterVerifyTokenNavigationContext);

  return [nav, setNav] as const;
}
