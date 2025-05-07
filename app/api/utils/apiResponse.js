import { NextResponse } from "next/server"

export function successResponse(data) {
  return NextResponse.json({ success: true, data }, { status: 200 })
}

export function errorResponse(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status })
}
