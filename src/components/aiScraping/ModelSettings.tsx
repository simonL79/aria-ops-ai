
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import useModels from './modelSettings/useModels';
import ModelsList from './modelSettings/ModelsList';
import AddModelDialog from './modelSettings/AddModelDialog';

const ModelSettings = () => {
  const {
    models,
    isTesting,
    activeTab,
    setActiveTab,
    isAddingModel,
    setIsAddingModel,
    newModel,
    setNewModel,
    handleAddModel,
    handleDeleteModel,
    handleToggleModel,
    handleTestModel
  } = useModels();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Models</h2>
        <Button onClick={() => setIsAddingModel(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </div>

      <ModelsList
        models={models}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleToggleModel={handleToggleModel}
        handleDeleteModel={handleDeleteModel}
        handleTestModel={handleTestModel}
        isTesting={isTesting}
      />

      <AddModelDialog
        isOpen={isAddingModel}
        onOpenChange={setIsAddingModel}
        onAddModel={handleAddModel}
        newModel={newModel}
        setNewModel={setNewModel}
      />
    </div>
  );
};

export default ModelSettings;
