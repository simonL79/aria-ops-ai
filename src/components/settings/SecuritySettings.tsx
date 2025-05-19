
import { useEffect } from 'react';
import { hasValidKey } from "@/utils/secureKeyStorage";
import { toast } from "sonner";
import ApiKeyManagement from "./security/ApiKeyManagement";
import ContentSafetySettings from "./security/ContentSafetySettings";
import AdvancedSecuritySettings from "./security/AdvancedSecuritySettings";
import { useNavigate } from 'react-router-dom';

const SecuritySettings = () => {
  const navigate = useNavigate();
  
  // When component mounts, check if API key exists
  useEffect(() => {
    if (!hasValidKey('openai_api_key')) {
      toast.info("API Key Required", {
        description: "Please set your OpenAI API key for full functionality",
        action: {
          label: "Get Key",
          onClick: () => window.open("https://platform.openai.com/api-keys", "_blank")
        }
      });
    }
  }, []);
  
  return (
    <div className="space-y-6">
      <ApiKeyManagement />
      <ContentSafetySettings />
      <AdvancedSecuritySettings />
    </div>
  );
};

export default SecuritySettings;
