
export const trackEvent = (eventName: string, data?: any) => {
    if (typeof window !== "undefined") {
        // Initialize fbq if it doesn't exist to allow queuing
        if (!(window as any).fbq) {
            (window as any).fbq = function () {
                ((window as any).fbq.queue = (window as any).fbq.queue || []).push(arguments);
            };
        }

        const fbq = (window as any).fbq;
        fbq("track", eventName, data);
    }
};
