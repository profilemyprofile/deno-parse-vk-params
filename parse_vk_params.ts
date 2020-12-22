import { hmac, qsParse, qsStringify } from "./deps.ts";

export type VKParams = {
  vk_user_id: string;
  vk_app_id: string;
  vk_is_app_user: "0" | "1";
  vk_are_notifications_enabled: "0" | "1";
  vk_language: "ru" | "uk, ua" | "en" | "be" | "kz" | "pt" | "es";
  vk_ref: string;
  vk_access_token_settings: string;
  vk_group_id: string;
  vk_viewer_group_role: "none" | "member" | "moder" | "editor" | "admin";
  vk_platform:
    | "mobile_android"
    | "mobile_iphone"
    | "mobile_web"
    | "desktop_web"
    | "mobile_android_messenger"
    | "mobile_iphone_messenger";
  vk_is_favorite: "0" | "1";
  vk_ts: string;
  sign: string;
};

export type ParsingResultSuccess = VKParams & { isCorrect: true };
export type ParsingResultFailed = { isCorrect: false };
export type ParsingResult = ParsingResultSuccess | ParsingResultFailed;

/**
 * Проверяет правильность параметров запуска.
 * В случае несовпадения возвращает ```{ isCorrect: false }```.
 * 
 * Если параметры верны, возвращает объект ```VKParams``` со свойством ```isCorrect``` как ```true```
 */
export function parseVKParams(
  search: string,
  secretKey: string,
): ParsingResult {
  if (!search) {
    return { isCorrect: false };
  }

  const params = qsParse(search) as VKParams;
  const ordered = {} as VKParams;

  Object.keys(params).sort().forEach((key) => {
    if (key.startsWith("vk_")) {
      if (key in params) {
        // deno-lint-ignore no-explicit-any
        (ordered as any)[key] = params[key as keyof VKParams];
      }
    }
  });

  let hash = hmac(
    "sha256",
    secretKey,
    qsStringify(ordered),
    "utf8",
    "base64",
  );

  typeof hash !== "string" && (hash = "");

  hash = hash.replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=$/, "");

  return {
    ...ordered,
    isCorrect: params.sign === hash,
  };
}
