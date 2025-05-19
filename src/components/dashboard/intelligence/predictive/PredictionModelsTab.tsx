
import { PredictionModel } from "@/types/intelligence";
import PredictionModelCard from "./PredictionModelCard";

interface PredictionModelsTabProps {
  models: PredictionModel[];
}

const PredictionModelsTab = ({ models }: PredictionModelsTabProps) => {
  return (
    <div className="space-y-4">
      {models.map(model => (
        <PredictionModelCard key={model.id} model={model} />
      ))}
    </div>
  );
};

export default PredictionModelsTab;
