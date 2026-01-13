export const devLogger = {
  debug: (...args: unknown[]) => {
    // Only log in development
    if (!import.meta.env.DEV) return;

    const filtered = args.map((arg) => {
      if (arg && typeof arg === "object") {
        try {
          const copy: Record<string, unknown> = Array.isArray(arg)
            ? arg.slice()
            : { ...(arg as Record<string, unknown>) };

          // Redact common sensitive fields if present
          if ("password" in copy) copy.password = "[REDACTED]";
          if ("token" in copy) copy.token = "[REDACTED]";
          if ("refreshToken" in copy) copy.refreshToken = "[REDACTED]";
          if ("authorization" in copy) copy.authorization = "[REDACTED]";
          if ("email" in copy) copy.email = "[REDACTED]";

          return copy;
        } catch (_) {
          return "[UNSERIALIZABLE]";
        }
      }
      return arg;
    });

    console.debug("[DEV]", ...filtered);
  },
};
