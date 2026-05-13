import { supabase } from "@/lib/supabase";

export async function getUserRole(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.log("Role fetch error:", error);
      return null;
    }

    return data?.role || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function isAdmin(role: string | null) {
  return (
    role === "SUPER_ADMIN" ||
    role === "ADMIN"
  );
}

export function isCompliance(role: string | null) {
  return role === "COMPLIANCE";
}

export function isPayout(role: string | null) {
  return role === "PAYOUT";
}

export function isClient(role: string | null) {
  return role === "CLIENT";
}