import { Paper, type PaperProps } from '@mantine/core';
import cx from 'clsx';
import classes from './message.module.css';

interface MessageProps extends PaperProps {
  from: 'user' | 'assistant' | 'system';
  children: React.ReactNode;
}

export const Message = ({ from, children, className, ...p }: MessageProps) => {
  return (
    <Paper className={cx(classes.root, className)} mod={{ from }} {...p}>
      {children}
    </Paper>
  );
};
