"use client";

import dynamic from "next/dynamic";

const PlanoraBot = dynamic(() => import("@/components/shared/PlanoraBot"), {
  ssr: false,
});

export default function BotWrapper() {
  return <PlanoraBot />;
}
