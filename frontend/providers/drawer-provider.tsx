import { createContext, useContext, ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Drawer } from '@mantine/core';
import { DrawerHookProps, useDrawer } from '@/hooks/useDrawer';
import { X } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { usePathname } from 'next/navigation';

export interface DrawerContextType {
  openDrawer: (props: DrawerHookProps) => void;
  closeDrawer: (key?: string) => void;
  stackedDrawers: DrawerHookProps[];
}
// Define DrawerContext
const DrawerContext = createContext<DrawerContextType | null>(null);

export const DrawerTitle = ({ title, className }: { title: string; className?: string }) => {
  return <h2 className={cn('text-xl font-semibold text-gray-700 dark:text-white capitalize', className)}>{title}</h2>;
};

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const { stackedDrawers, openDrawer, closeDrawer } = useDrawer();
  const pathName = usePathname();

  // Variants for animation
  const drawerContentVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  useEffect(() => {
    closeDrawer();
  }, [pathName]);

  return (
    <DrawerContext.Provider value={{ stackedDrawers, openDrawer, closeDrawer }}>
      {stackedDrawers.map((drawer, index) => (
        <Drawer
          key={drawer.key || index}
          offset={drawer.offset || 12}
          radius={drawer.radius || 12}
          closeOnEscape
          opened={true}
          onClose={closeDrawer}
          p={0}
          size={drawer.size || 'auto'}
          withCloseButton={false}
          position='right'
          classNames={{
            content: "bg-white dark:bg-gray-900",
            body: "bg-white dark:bg-gray-900",
          }}
        >
          {/* Wrap the entire content in AnimatePresence and motion.div */}
          <AnimatePresence mode='wait'>
            <motion.div
              className={cn(
                'flex flex-col min-w-[400px] overflow-y-hidden h-full',
                'bg-white dark:bg-gray-900',
                drawer.drawerWrapperClassName,
              )}
              variants={drawerContentVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
              transition={{ duration: 0.2 }}
            >
              {drawer.asChild ? (
                <>{drawer.body}</>
              ) : (
                <>
                  <header
                    className={cn(
                      'flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-800',
                      'bg-white dark:bg-gray-900',
                      drawer.drawerHeaderClassName,
                    )}
                  >
                    {drawer.headerContent ? (
                      <>{drawer.headerContent}</>
                    ) : (
                      <>{drawer.title && <DrawerTitle title={drawer.title} />}</>
                    )}
                    {!drawer.hideCloseButton && (
                      <button
                        className='group bg-teal-100 hover:bg-teal-500 dark:bg-gray-800 dark:hover:bg-teal-600 p-2 rounded-full transition-colors'
                        onClick={() => closeDrawer(drawer.key)}
                      >
                        <X
                          size={16}
                          className='shrink-0 text-teal-500 group-hover:text-teal-50 dark:text-gray-400 dark:group-hover:text-white'
                        />
                      </button>
                    )}
                  </header>

                  {/* Drawer Body */}
                  <div
                    className={cn(
                      'p-6 flex flex-col grow overflow-y-scroll',
                      'bg-white dark:bg-gray-900',
                      drawer.bodyClassName,
                    )}
                  >
                    {drawer.body}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </Drawer>
      ))}

      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = (): DrawerContextType => {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error('useDrawerContext must be used within a DrawerProvider');
  }

  return context;
};
