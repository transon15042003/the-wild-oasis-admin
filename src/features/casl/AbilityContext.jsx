import { createContext, useContext } from "react";
import { defineAbilityFor } from "./ability";
import useUser from "../authentication/useUser";

const AbilityContext = createContext(null);

export function AbilityProvider({ children }) {
    const { user } = useUser();
    const ability = defineAbilityFor(user);

    return (
        <AbilityContext.Provider value={ability}>
            {children}
        </AbilityContext.Provider>
    );
}

export function useAbility() {
    const ability = useContext(AbilityContext);
    if (!ability) {
        throw new Error(
            "AbilityContext is not provided. Wrap the tree with <AbilityProvider>."
        );
    }
    return ability;
}

/** Minimal Can — same I / a props as @casl/react */
export function Can({ I, a, children }) {
    const ability = useAbility();
    if (!ability.can(I, a)) return null;
    return children;
}
