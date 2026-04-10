import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return document.cookie
          .split("; ")
          .map((c) => {
            const [name, ...valueParts] = c.split("=");
            return { name, value: valueParts.join("=") };
          })
          .filter((c) => c.name);
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          let cookieStr = `${name}=${value};path=/`;
          if (options?.maxAge) cookieStr += `;max-age=${options.maxAge}`;
          if (options?.expires) cookieStr += `;expires=${options.expires.toUTCString()}`;
          if (options?.domain) cookieStr += `;domain=${options.domain}`;
          if (options?.sameSite) cookieStr += `;samesite=${options.sameSite}`;
          if (options?.secure) cookieStr += ";secure";
          document.cookie = cookieStr;
        });
      },
    },
  });
}
