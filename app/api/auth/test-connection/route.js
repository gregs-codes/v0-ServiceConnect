import { supabaseAdmin } from "@/lib/supabase"
import { successResponse, errorResponse } from "@/app/api/utils/apiResponse"

export async function GET() {
  try {
    // Test the Supabase connection
    const { data, error } = await supabaseAdmin.auth.getSession()

    if (error) {
      console.error("Supabase connection error:", error)
      return errorResponse(`Supabase connection error: ${error.message}`, 500)
    }

    // Test database access
    const { data: testData, error: testError } = await supabaseAdmin.from("profiles").select("count").limit(1)

    if (testError) {
      console.error("Database access error:", testError)
      return errorResponse(`Database access error: ${testError.message}`, 500)
    }

    return successResponse({
      message: "Supabase connection successful",
      sessionData: data || null,
      databaseAccess: "OK",
      testData,
    })
  } catch (error) {
    console.error("Test connection error:", error)
    return errorResponse(`Test connection error: ${error.message}`, 500)
  }
}
