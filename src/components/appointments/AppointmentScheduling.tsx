import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { LoadingSpinner } from "../loading-spinner";
import { AppointmentForm } from "./AppointmentForm";
import { AppointmentList } from "./AppointmentList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CalendarPlus } from "lucide-react";

export function AppointmentScheduling() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const appointments = useQuery(
    api.appointments.getAppointmentsByPatient,
    userData?._id ? { patientId: userData._id } : "skip",
  );

  const professionals = useQuery(api.users.getAllProfessionals);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-[#1D1D1F]">
          Agendamento de Consultas
        </h2>
        <Button
          onClick={() => setIsScheduleDialogOpen(true)}
          className="bg-[#0066CC] hover:bg-[#0077ED] text-white"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Agendar Consulta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Minhas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentList
            appointments={appointments || []}
            professionals={professionals || []}
          />
        </CardContent>
      </Card>

      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agendar Nova Consulta</DialogTitle>
          </DialogHeader>
          <AppointmentForm
            professionals={professionals || []}
            onSuccess={() => setIsScheduleDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
