export async function POST(request: Request) {
  try {
    const { handle, platform } = await request.json()

    if (!handle || handle.trim().length === 0) {
      return Response.json({ valid: false, error: "Handle cannot be empty" }, { status: 400 })
    }

    const cleanHandle = handle.trim().replace("@", "")

    // Check for invalid characters
    if (!/^[a-zA-Z0-9._-]+$/.test(cleanHandle)) {
      return Response.json({ valid: false, error: "Incorrect username" }, { status: 400 })
    }

    // Check handle length
    if (cleanHandle.length < 3 || cleanHandle.length > 30) {
      return Response.json({ valid: false, error: "Incorrect username" }, { status: 400 })
    }

    // Accept all properly formatted handles
    // Real validation would require API keys for each platform (YouTube Data API, Instagram Graph API, etc.)
    // For now, we validate format only and accept the handle

    return Response.json({ valid: true, platform })
  } catch (error) {
    return Response.json({ valid: false, error: "Validation error" }, { status: 500 })
  }
}
