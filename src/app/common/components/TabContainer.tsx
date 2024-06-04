import { Tabs, Tab } from "@mui/material";
import { Panel, PanelHeader } from "./Panel";
import React, { ReactElement } from "react";

interface TabPaneProps {
  id: string;
  tabLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  disablePaper?: boolean;
  icon?: React.ReactElement;
}

interface TabContainerProps {
  children: ReactElement<TabPaneProps>[] | ReactElement<TabPaneProps>;
  defaultTab?: string | undefined;
}

export const TabPane: React.FC<TabPaneProps> = ({ children }) => {
  return <>{children}</>;
};

export const TabContainer: React.FC<TabContainerProps> = ({
  children,
  defaultTab,
}) => {
  const tabChildren = React.Children.toArray(children).filter(
    (child) => (child as React.ReactElement).type === TabPane
  );
  const tabIndexMap: { [id: string]: number } = {};
  tabChildren.forEach((child, index) => {
    const tabId = (child as React.ReactElement<TabPaneProps>).props.id;
    if (tabId) {
      tabIndexMap[tabId] = index;
    }
  });

  const initialTabIndex = defaultTab ? tabIndexMap[defaultTab] : 0;

  const [selectedTab, setSelectedTab] = React.useState(initialTabIndex);

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Panel
      disablePaper={
        (tabChildren[selectedTab] as React.ReactElement<TabPaneProps>).props
          .disablePaper
      }
    >
      <PanelHeader>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
        >
          {tabChildren.map((child, index) => (
            <Tab
              key={index}
              label={(child as React.ReactElement).props.tabLabel}
              disabled={(child as React.ReactElement).props.disabled}
              iconPosition="start"
              icon={(child as ReactElement).props.icon}
            />
          ))}
        </Tabs>
      </PanelHeader>
      {tabChildren[selectedTab]}
    </Panel>
  );
};
