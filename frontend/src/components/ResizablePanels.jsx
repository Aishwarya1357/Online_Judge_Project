import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const ResizablePanels = ({ leftPanel, rightPanel }) => {
  return (
    <PanelGroup direction="horizontal" className="flex flex-grow gap-6">
      <Panel defaultSize={50} minSize={30}>
        {leftPanel}
      </Panel>
      <PanelResizeHandle className="w-2 bg-gray-700 hover:bg-cyan-400 active:bg-cyan-500 rounded-full transition-colors" />
      <Panel defaultSize={50} minSize={30}>
        {rightPanel}
      </Panel>
    </PanelGroup>
  );
};

export default ResizablePanels;
