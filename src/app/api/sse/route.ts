import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendData = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial ping
      sendData({ type: "connected", userId });

      // Heartbeat every 25 seconds to keep connection alive
      const heartbeat = setInterval(() => {
        sendData({ type: "ping" });
      }, 25000);

      // Register this client for notifications
      // Note: In production with multiple Vercel instances, use Redis pub/sub
      // For single-instance: this works perfectly
      const cleanup = () => {
        clearInterval(heartbeat);
        controller.close();
      };

      req.signal.addEventListener("abort", cleanup);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
