import type { InputVariant, MantineRadius, MantineSize } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { createContext, type ReactNode, useContext } from 'react';

interface PromptInputContext {
  disabled?: boolean;
  form: UseFormReturnType<{ prompt: string }>;
  variant?: InputVariant;
  size?: MantineSize;
  radius?: MantineRadius;
}

const PromptInputContext = createContext<PromptInputContext | null>(null);

export const PromptInputProvider = ({
  children,
  disabled,
  form,
  variant,
  size,
  radius,
}: PromptInputContext & { children: ReactNode }) => {
  const value = {
    disabled,
    form,
    variant,
    size,
    radius,
  };

  return (
    <PromptInputContext.Provider value={value}>
      {children}
    </PromptInputContext.Provider>
  );
};

export const usePromptInput = () => {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error('usePromptInput must be used within PromptInputProvider');
  }
  return context;
};
