import { supabase } from "@/lib/supabase";

type AuditLogParams = {
  user_id?: string;
  user_email?: string;

  action: string;

  entity_type: string;
  entity_id: string;

  details?: string;
};

export async function createAuditLog({
  user_id,
  user_email,
  action,
  entity_type,
  entity_id,
  details,
}: AuditLogParams) {
  try {
    const { error } = await supabase
      .from("audit_logs")
      .insert([
        {
          user_id,
          user_email,

          action,

          entity_type,
          entity_id,

          details,
        },
      ]);

    if (error) {
      console.log(
        "Audit log error:",
        error.message
      );
    }
  } catch (error) {
    console.log(error);
  }
}