import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { LoadingSpinner } from "../loading-spinner";

type AddHealthMetricFormProps = {
  type: string;
  onSuccess: () => void;
};

export function AddHealthMetricForm({
  type,
  onSuccess,
}: AddHealthMetricFormProps) {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const addHealthMetric = useMutation(api.healthMetrics.addHealthMetric);

  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (type === "bloodPressure") {
        await addHealthMetric({
          type,
          value: 0, // Valor não usado para pressão arterial
          unit: "mmHg",
          notes,
          systolic: parseInt(systolic),
          diastolic: parseInt(diastolic),
        });
      } else {
        await addHealthMetric({
          type,
          value: parseFloat(value),
          unit: type === "glucose" ? "mg/dL" : "bpm",
          notes,
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Erro ao adicionar métrica:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    switch (type) {
      case "bloodPressure":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Sistólica (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastólica (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  required
                />
              </div>
            </div>
          </>
        );
      case "glucose":
        return (
          <div className="space-y-2">
            <Label htmlFor="glucose">Glicemia (mg/dL)</Label>
            <Input
              id="glucose"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="100"
              required
            />
          </div>
        );
      case "heartRate":
        return (
          <div className="space-y-2">
            <Label htmlFor="heartRate">Frequência Cardíaca (bpm)</Label>
            <Input
              id="heartRate"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="75"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFormFields()}

      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Adicione observações sobre esta medição"
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0066CC] hover:bg-[#0077ED] text-white"
        >
          {isSubmitting ? <LoadingSpinner /> : "Salvar Medição"}
        </Button>
      </div>
    </form>
  );
}
