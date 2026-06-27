import { Eye, Phone, MessageCircle, Star } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

interface StatsOverviewProps {
  vues: number;
  appels: number;
  clicsWhatsApp: number;
  noteMoyenne: number;
  tendances?: {
    vues?: number;
    appels?: number;
    clicsWhatsApp?: number;
    noteMoyenne?: number;
  };
}

export function StatsOverview({
  vues,
  appels,
  clicsWhatsApp,
  noteMoyenne,
  tendances,
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Eye className="h-5 w-5" />}
        value={vues.toLocaleString("fr-FR")}
        label="Vues"
        variant="amber"
        trend={
          tendances?.vues != null
            ? { value: tendances.vues, direction: tendances.vues >= 0 ? "up" : "down" }
            : undefined
        }
      />
      <StatCard
        icon={<Phone className="h-5 w-5" />}
        value={appels.toLocaleString("fr-FR")}
        label="Appels"
        variant="green"
        trend={
          tendances?.appels != null
            ? { value: tendances.appels, direction: tendances.appels >= 0 ? "up" : "down" }
            : undefined
        }
      />
      <StatCard
        icon={<MessageCircle className="h-5 w-5" />}
        value={clicsWhatsApp.toLocaleString("fr-FR")}
        label="Clics WhatsApp"
        variant="orange"
        trend={
          tendances?.clicsWhatsApp != null
            ? { value: tendances.clicsWhatsApp, direction: tendances.clicsWhatsApp >= 0 ? "up" : "down" }
            : undefined
        }
      />
      <StatCard
        icon={<Star className="h-5 w-5" />}
        value={noteMoyenne.toFixed(1)}
        label="Note moyenne"
        variant="purple"
        trend={
          tendances?.noteMoyenne != null
            ? { value: tendances.noteMoyenne, direction: tendances.noteMoyenne >= 0 ? "up" : "down" }
            : undefined
        }
      />
    </div>
  );
}
