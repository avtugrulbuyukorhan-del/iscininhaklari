import { redirect } from "next/navigation";
import { toolsHub } from "@/lib/silos";

export default function HesaplamaIndexPage() {
  redirect(toolsHub.path);
}
