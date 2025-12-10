import { forwardRef, useImperativeHandle } from 'react';
import type { File } from '@/types';
import { type FilesProps, Provider, useFiles } from './Provider';

export interface FilesRef {
	downloadAllFiles: () => Promise<void>;
	files: File[];
}

export const Root = forwardRef<FilesRef, FilesProps>(
	({ children, ...props }, ref) => {
		return (
			<Provider {...props}>
				<FilesRefHandler ref={ref}>{children}</FilesRefHandler>
			</Provider>
		);
	},
);

const FilesRefHandler = forwardRef<FilesRef, { children: React.ReactNode }>(
	({ children }, ref) => {
		const { files, downloadAllFiles } = useFiles();

		useImperativeHandle(
			ref,
			() => ({
				downloadAllFiles,
				files,
			}),
			[downloadAllFiles, files],
		);

		return <>{children}</>;
	},
);
