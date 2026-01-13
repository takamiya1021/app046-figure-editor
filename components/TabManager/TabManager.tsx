/**
 * タブマネージャーコンポーネント
 */

'use client';

import { useTabManager } from '@/hooks/useTabManager';
import TabButton from './TabButton';
import AddTabButton from './AddTabButton';

export default function TabManager() {
  const { tabs, activeTabId, addTab, removeTab, setActiveTab } = useTabManager();

  const canDeleteTab = tabs.length > 1;

  return (
    <div className="w-full">
      <div
        className="flex items-end gap-1 border-b border-gray-300"
        role="tablist"
        aria-label="タブ一覧"
      >
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            id={tab.id}
            name={tab.name}
            isActive={tab.id === activeTabId}
            onClick={setActiveTab}
            onDelete={removeTab}
            canDelete={canDeleteTab}
          />
        ))}
        <div className="flex items-center px-2 pb-1">
          <AddTabButton onClick={addTab} />
        </div>
      </div>
    </div>
  );
}
