import {
    AbilityProvider as CaslAbilityProvider,
    Can,
    useAbility,
} from "@casl/react";
import { defineAbilityFor } from "./ability";
import useUser from "../authentication/useUser";

export { Can, useAbility };

export function AbilityProvider({ children }) {
    const { user } = useUser();
    const ability = defineAbilityFor(user);

    return (
        <CaslAbilityProvider ability={ability}>
            {children}
        </CaslAbilityProvider>
    );
}
