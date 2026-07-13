/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

function TurnstileWidget({ onSuccess, onExpire }) {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    const onSuccessRef = useRef(onSuccess);
    const onExpireRef = useRef(onExpire);

    onSuccessRef.current = onSuccess;
    onExpireRef.current = onExpire;

    useEffect(() => {
        if (!SITE_KEY) {
            onSuccessRef.current?.("dev-bypass");
            return;
        }

        let cancelled = false;

        function renderWidget() {
            if (cancelled || !containerRef.current || !window.turnstile) return;

            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: SITE_KEY,
                callback: (token) => onSuccessRef.current?.(token),
                "expired-callback": () => onExpireRef.current?.(),
                "error-callback": () => onExpireRef.current?.(),
            });
        }

        if (window.turnstile) {
            renderWidget();
        } else {
            const existing = document.querySelector(
                'script[data-turnstile="true"]'
            );
            if (!existing) {
                const script = document.createElement("script");
                script.src =
                    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
                script.async = true;
                script.dataset.turnstile = "true";
                script.onload = renderWidget;
                document.head.appendChild(script);
            } else {
                existing.addEventListener("load", renderWidget);
            }
        }

        return () => {
            cancelled = true;
            if (widgetIdRef.current != null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
            }
        };
    }, []);

    if (!SITE_KEY) {
        return (
            <p style={{ fontSize: "1.2rem", color: "var(--color-grey-500)" }}>
                Turnstile skipped (no VITE_TURNSTILE_SITE_KEY).
            </p>
        );
    }

    return <div ref={containerRef} />;
}

export default TurnstileWidget;
