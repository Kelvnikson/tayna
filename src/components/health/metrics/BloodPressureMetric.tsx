import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatDate } from "../../../lib/utils";

type BloodPressureData = {
  _id: string;
  systolic: number;
  diastolic: number;
  timestamp: number;
  isAbnormal: boolean;
  notes?: string;
};

export function BloodPressureMetric({ data }: { data: BloodPressureData[] }) {
  // Ordenar dados por timestamp (mais recente primeiro)
  const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
  const latestReading = sortedData[0];

  return (
    <div className="space-y-4">
      {latestReading ? (
        <Card
          className={`${latestReading.isAbnormal ? "border-red-200 bg-red-50" : "bg-white"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex justify-between">
              <span>Última Medição</span>
              <span className="text-sm text-gray-500">
                {formatDate(latestReading.timestamp)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="text-center px-6">
                <div className="text-4xl font-bold text-[#1D1D1F]">
                  {latestReading.systolic}
                </div>
                <div className="text-sm text-[#86868B] mt-1">Sistólica</div>
              </div>
              <div className="text-4xl font-bold text-[#86868B] px-2">/</div>
              <div className="text-center px-6">
                <div className="text-4xl font-bold text-[#1D1D1F]">
                  {latestReading.diastolic}
                </div>
                <div className="text-sm text-[#86868B] mt-1">Diastólica</div>
              </div>
              <div className="text-sm text-[#86868B] ml-2">mmHg</div>
            </div>
            {latestReading.isAbnormal && (
              <div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md text-sm">
                Atenção: Valores fora da faixa normal (90-140/60-90 mmHg)
              </div>
            )}
            {latestReading.notes && (
              <div className="mt-2 text-sm text-[#86868B]">
                <span className="font-medium">Observações:</span>{" "}
                {latestReading.notes}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-[#86868B]">
              Nenhuma medição de pressão arterial registrada.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Histórico de Medições
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F5F5F7]">
                    <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                      Data
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                      Sistólica
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                      Diastólica
                    </th>
                    <th className="text-left py-2 px-4 text-sm font-medium text-[#86868B]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((reading) => (
                    <tr
                      key={reading._id}
                      className="border-b border-[#F5F5F7] last:border-0"
                    >
                      <td className="py-3 px-4 text-sm">
                        {formatDate(reading.timestamp)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {reading.systolic} mmHg
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {reading.diastolic} mmHg
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            reading.isAbnormal
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {reading.isAbnormal ? "Anormal" : "Normal"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-[#86868B]">
              Nenhuma medição registrada.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
