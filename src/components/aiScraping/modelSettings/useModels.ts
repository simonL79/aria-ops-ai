
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ModelConfig } from '@/types/aiScraping';
import { getModels, updateModel, deleteModel, testModel } from '@/services/modelsService';

export const useModels = () => {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModel, setNewModel] = useState<Partial<ModelConfig>>({
    name: '',
    type: 'huggingface',
    usage: 'sentiment',
    config: {
      model: '',
      temperature: 0.7,
      maxTokens: 500,
      useLocal: false
    },
    active: true
  });

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelsList = await getModels();
        setModels(modelsList);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    
    loadModels();
  }, []);

  const handleAddModel = async (model: ModelConfig) => {
    try {
      await updateModel(model);
      setModels([...models, model]);
      setNewModel({
        name: '',
        type: 'huggingface',
        usage: 'sentiment',
        config: {
          model: '',
          temperature: 0.7,
          maxTokens: 500,
          useLocal: false
        },
        active: true
      });

      toast.success("Model added", {
        description: `${model.name} has been added to your models`
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding model:", error);
      toast.error("Failed to add model");
      return Promise.reject(error);
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      await deleteModel(id);
      setModels(models.filter(model => model.id !== id));
      toast.success("Model removed", {
        description: "The model has been removed"
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error("Failed to remove model");
      return Promise.reject(error);
    }
  };

  const handleToggleModel = async (id: string, active: boolean) => {
    try {
      const updatedModels = models.map(model => 
        model.id === id ? { ...model, active } : model
      );
      
      const model = models.find(m => m.id === id);
      if (!model) return Promise.reject(new Error("Model not found"));
      
      await updateModel({ ...model, active });
      setModels(updatedModels);
      
      toast.success(`Model ${active ? 'activated' : 'deactivated'}`, {
        description: `${model.name} is now ${active ? 'active' : 'inactive'}`
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error toggling model:", error);
      toast.error("Failed to update model status");
      return Promise.reject(error);
    }
  };

  const handleTestModel = async (model: ModelConfig) => {
    setIsTesting(true);
    
    try {
      const result = await testModel(model.id);
      
      toast.success(`Test successful for ${model.name}`, {
        description: result?.message || "Model working correctly"
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error testing model:", error);
      toast.error(`Test failed for ${model.name}`, {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
      return Promise.reject(error);
    } finally {
      setIsTesting(false);
    }
  };

  return {
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
  };
};

export default useModels;
