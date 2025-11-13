"use client";
import useSWR, { SWRConfiguration } from "swr";

export function useJson<T = unknown>(url: string | null, config?: SWRConfiguration<T>) {
  return useSWR<T>(url, async (u: string) => {
    const res = await fetch(u);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }, { revalidateOnFocus: true, dedupingInterval: 5000, ...config });
}
