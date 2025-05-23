
import React from 'react';
import AddSourceDialog from './SourcesManager/components/AddSourceDialog';
import SourcesList from './SourcesManager/components/SourcesList';
import { useSourcesManager } from './SourcesManager/hooks/useSourcesManager';

const SourcesManager = () => {
  const {
    sources,
    loadSources,
    handleToggleSource,
    handleDeleteSource,
    handleRefreshSource
  } = useSourcesManager();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <AddSourceDialog onSourceAdded={loadSources} />
      </div>

      <SourcesList
        sources={sources}
        onToggleSource={handleToggleSource}
        onDeleteSource={handleDeleteSource}
        onRefreshSource={handleRefreshSource}
      />
    </div>
  );
};

export default SourcesManager;
