// src/hooks/useInView.js
import { useState, useEffect, useRef } from "react";

export function useInView(options) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, options);

        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [options]);

    return [ref, isVisible];
}