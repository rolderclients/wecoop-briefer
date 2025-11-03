import { Box, type BoxProps } from '@mantine/core';
import cx from 'clsx';
import classes from './promptInput.module.css';

export const Toolbar = ({
  className,
  ...props
}: BoxProps & { children: React.ReactNode }) => (
  <Box className={cx(classes.toolbar, className)} {...props} />
);
