import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BloodPressureMetric } from "./metrics/BloodPressureMetric";
import { GlucoseMetric } from "./metrics/GlucoseMetric";
import { HeartRateMetric } from "./metrics/HeartRateMetric";
import { AlertsPanel } from "./AlertsPanel";
import { AddHealthMetricForm } from "./AddHealthMetricForm";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export function HealthMetricsDashboard() {
  const { user } = useUser();
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [selectedMetricType, setSelectedMetricType] =
    useState<string>("bloodPressure");

  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const healthMetrics = useQuery(
    api.healthMetrics.getHealthMetricsByUser,
    userData?._id ? { userId: userData._id } : "skip",
  );

  const abnormalMetrics = useQuery(
    api.healthMetrics.getAbnormalMetrics,
    userData?._id ? { userId: userData._id } : "skip",
  );

  const bloodPressureData =
    healthMetrics?.filter((metric) => metric.type === "bloodPressure") || [];
  const glucoseData =
    healthMetrics?.filter((metric) => metric.type === "glucose") || [];
  const heartRateData =
    healthMetrics?.filter((metric) => metric.type === "heartRate") || [];

  const handleAddMetric = (type: string) => {
    setSelectedMetricType(type);
    setIsAddMetricOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#1D1D1F]">
          Métricas de Saúde
        </h2>
        <Button
          onClick={() => setIsAddMetricOpen(true)}
          className="bg-[#0066CC] hover:bg-[#0077ED] text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Métrica
        </Button>
      </div>

      {abnormalMetrics && abnormalMetrics.length > 0 && (
        <AlertsPanel alerts={abnormalMetrics} />
      )}

      <Tabs defaultValue="bloodPressure" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger
            value="bloodPressure"
            onClick={() => setSelectedMetricType("bloodPressure")}
            className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
          >
            Pressão Arterial
          </TabsTrigger>
          <TabsTrigger
            value="glucose"
            onClick={() => setSelectedMetricType("glucose")}
            className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
          >
            Glicemia
          </TabsTrigger>
          <TabsTrigger
            value="heartRate"
            onClick={() => setSelectedMetricType("heartRate")}
            className="data-[state=active]:bg-[#0066CC] data-[state=active]:text-white"
          >
            Freq. Cardíaca
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bloodPressure" className="space-y-4">
          <BloodPressureMetric data={bloodPressureData} />
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => handleAddMetric("bloodPressure")}
              className="text-[#0066CC] border-[#0066CC] hover:bg-[#F5F5F7]"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Medição
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="glucose" className="space-y-4">
          <GlucoseMetric data={glucoseData} />
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => handleAddMetric("glucose")}
              className="text-[#0066CC] border-[#0066CC] hover:bg-[#F5F5F7]"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Medição
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="heartRate" className="space-y-4">
          <HeartRateMetric data={heartRateData} />
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => handleAddMetric("heartRate")}
              className="text-[#0066CC] border-[#0066CC] hover:bg-[#F5F5F7]"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Medição
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddMetricOpen} onOpenChange={setIsAddMetricOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Métrica de Saúde</DialogTitle>
          </DialogHeader>
          <AddHealthMetricForm
            type={selectedMetricType}
            onSuccess={() => setIsAddMetricOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
