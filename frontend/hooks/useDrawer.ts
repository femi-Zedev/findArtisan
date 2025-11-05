import { useState } from 'react';

export interface DrawerHookProps {
  title?: string;
  offset?: number;
  body: React.JSX.Element;
  asChild?: boolean;
  radius?: number;
  size?: string;
  onClose?: () => void;
  hideCloseButton?: boolean;
  key?: string;
  headerContent?: React.JSX.Element;
  bodyClassName?: string;
  drawerWrapperClassName?: string;
  drawerHeaderClassName?: string;
}

export const useDrawer = () => {
  const [stackedDrawers, setStackedDrawers] = useState<DrawerHookProps[]>([]);

  const openDrawer = (props: DrawerHookProps) => {
    setStackedDrawers(current => {
      const existingIndex = current.findIndex(drawer => drawer.key === props.key);

      if (existingIndex > -1) {
        // If a drawer with the same key exists, update its content
        const updatedDrawers = [...current];
        updatedDrawers[existingIndex] = { ...updatedDrawers[existingIndex], ...props };
        return updatedDrawers;
      }

      // Otherwise, add a new drawer
      return [...current, props];
    });
  };

  const closeDrawer = (key?: string) => {
    setStackedDrawers(current => {
      if (!key) {
        // Close the last drawer if no key is provided
        return current.slice(0, -1);
      }

      // Remove the drawer with the matching key
      return current.filter(drawer => drawer.key !== key);
    });
  };

  return { stackedDrawers, openDrawer, closeDrawer };
};
