import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { LoadingSpinner } from "../loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type Professional = {
  _id: string;
  name: string;
  specialization?: string;
};

type AppointmentFormProps = {
  professionals: Professional[];
  onSuccess: () => void;
};

export function AppointmentForm({
  professionals,
  onSuccess,
}: AppointmentFormProps) {
  const createAppointment = useMutation(api.appointments.createAppointment);

  const [professionalId, setProfessionalId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [type, setType] = useState<string>("presencial");
  const [location, setLocation] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obter a data de hoje formatada para o input date
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createAppointment({
        professionalId,
        date,
        time,
        notes,
        type,
        location: type === "presencial" ? location : undefined,
      });
      onSuccess();
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="professional">Profissional</Label>
        <Select
          value={professionalId}
          onValueChange={setProfessionalId}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um profissional" />
          </SelectTrigger>
          <SelectContent>
            {professionals.map((professional) => (
              <SelectItem key={professional._id} value={professional._id}>
                {professional.name}{" "}
                {professional.specialization
                  ? `(${professional.specialization})`
                  : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Horário</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Consulta</Label>
        <RadioGroup
          value={type}
          onValueChange={setType}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="presencial" id="presencial" />
            <Label htmlFor="presencial" className="cursor-pointer">
              Presencial
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="telemedicina" id="telemedicina" />
            <Label htmlFor="telemedicina" className="cursor-pointer">
              Telemedicina
            </Label>
          </div>
        </RadioGroup>
      </div>

      {type === "presencial" && (
        <div className="space-y-2">
          <Label htmlFor="location">Local</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Endereço da consulta"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Motivo da consulta, sintomas, etc."
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0066CC] hover:bg-[#0077ED] text-white"
        >
          {isSubmitting ? <LoadingSpinner /> : "Agendar Consulta"}
        </Button>
      </div>
    </form>
  );
}
