
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ModelConfig } from '@/types/aiScraping';
import ModelFormFields from './ModelFormFields';

interface AddModelDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddModel: (model: ModelConfig) => Promise<void>;
  newModel: Partial<ModelConfig>;
  setNewModel: (model: Partial<ModelConfig>) => void;
}

const AddModelDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddModel,
  newModel,
  setNewModel
}: AddModelDialogProps) => {
  
  const handleAddModel = async () => {
    if (!newModel.name) {
      toast.error("Model name is required");
      return;
    }

    if (!newModel.config?.model) {
      toast.error("Model identifier is required");
      return;
    }

    try {
      const model: ModelConfig = {
        id: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newModel.name || '',
        type: (newModel.type as ModelConfig['type']) || 'huggingface',
        usage: (newModel.usage as ModelConfig['usage']) || 'sentiment',
        isDefault: newModel.isDefault || false,
        parameters: {
          temperature: newModel.parameters?.temperature || 0.7,
          maxTokens: newModel.parameters?.maxTokens,
          topP: newModel.parameters?.topP,
          frequencyPenalty: newModel.parameters?.frequencyPenalty,
          presencePenalty: newModel.parameters?.presencePenalty
        },
        config: {
          model: newModel.config?.model || '',
          temperature: newModel.config?.temperature || 0.7,
          maxTokens: newModel.config?.maxTokens || 500,
          apiKey: newModel.config?.apiKey,
          endpoint: newModel.config?.endpoint,
          useLocal: newModel.config?.useLocal || false
        },
        costPerToken: newModel.costPerToken || undefined,
        active: newModel.active || true
      };

      await onAddModel(model);
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding model:", error);
      toast.error("Failed to add model");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add AI Model</DialogTitle>
          <DialogDescription>
            Configure AI models to use for different tasks in A.R.I.A™
          </DialogDescription>
        </DialogHeader>
        
        <ModelFormFields 
          model={newModel} 
          onChange={setNewModel} 
        />
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddModel}>
            Add Model
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddModelDialog;
