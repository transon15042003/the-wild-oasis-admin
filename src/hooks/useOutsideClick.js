import { useEffect, useRef } from "react";

function useOutsideClick(handler, listenCapturing = true) {
    const ref = useRef();

    useEffect(() => {
        const handleClick = (e) => {
            // e.stopImmediatePropagation();
            // console.log("Click out");
            if (ref.current && !ref.current.contains(e.target)) {
                handler();
            }
            return;
        };

        document.addEventListener("mousedown", handleClick, listenCapturing);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClick,
                listenCapturing
            );
    });

    return ref;
}

export default useOutsideClick;
