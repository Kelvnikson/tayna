import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { formatDate } from "../../lib/utils";
import { AlertCircle } from "lucide-react";

type AlertData = {
  _id: string;
  type: string;
  value: number;
  unit: string;
  timestamp: number;
  systolic?: number;
  diastolic?: number;
};

export function AlertsPanel({ alerts }: { alerts: AlertData[] }) {
  // Ordenar alertas por timestamp (mais recente primeiro)
  const sortedAlerts = [...alerts].sort((a, b) => b.timestamp - a.timestamp);

  // Limitar a 3 alertas mais recentes
  const recentAlerts = sortedAlerts.slice(0, 3);

  const getAlertMessage = (alert: AlertData) => {
    switch (alert.type) {
      case "bloodPressure":
        return `Pressão arterial anormal: ${alert.systolic}/${alert.diastolic} mmHg`;
      case "glucose":
        return `Nível de glicose anormal: ${alert.value} ${alert.unit}`;
      case "heartRate":
        return `Frequência cardíaca anormal: ${alert.value} ${alert.unit}`;
      default:
        return `Valor anormal: ${alert.value} ${alert.unit}`;
    }
  };

  if (recentAlerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-red-600 flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        Alertas Recentes
      </h3>
      {recentAlerts.map((alert) => (
        <Alert key={alert._id} variant="destructive">
          <AlertTitle className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {alert.type === "bloodPressure"
              ? "Pressão Arterial"
              : alert.type === "glucose"
                ? "Glicemia"
                : alert.type === "heartRate"
                  ? "Frequência Cardíaca"
                  : "Alerta"}
          </AlertTitle>
          <AlertDescription className="flex justify-between">
            <span>{getAlertMessage(alert)}</span>
            <span className="text-sm opacity-70">
              {formatDate(alert.timestamp)}
            </span>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
