import { z } from "zod";

export const ShortenPayload = z.object({
  longUrl: z.string().url(),
});

export type ShortenPayload = z.infer<typeof ShortenPayload>;

export type ShortenRespone = {
  longUrl: string;
  link: string;
  id: string;
};
