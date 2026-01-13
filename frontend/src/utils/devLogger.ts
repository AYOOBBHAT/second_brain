export const devLogger = {
  debug: (...args: unknown[]) => {
    // Only log in development
    if (!import.meta.env.DEV) return;

    const filtered = args.map((arg) => {
      if (arg && typeof arg === "object") {
        try {
          // Handle arrays separately so TypeScript types are correct
          if (Array.isArray(arg)) {
            return arg.map((item) => {
              if (item && typeof item === "object") {
                const itemCopy = { ...(item as Record<string, unknown>) };
                if ("password" in itemCopy) itemCopy.password = "[REDACTED]";
                if ("token" in itemCopy) itemCopy.token = "[REDACTED]";
                if ("refreshToken" in itemCopy)
                  itemCopy.refreshToken = "[REDACTED]";
                if ("authorization" in itemCopy)
                  itemCopy.authorization = "[REDACTED]";
                if ("email" in itemCopy) itemCopy.email = "[REDACTED]";
                return itemCopy;
              }
              return item;
            });
          }

          const copy: Record<string, unknown> = { ...(arg as Record<string, unknown>) };

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
