import { Content } from './Content';
import { Dropzone } from './Dropzone';
import { List } from './List';
import { Provider, useFiles } from './Provider';
import { Root } from './Root';

export const Files = {
	Root,
	Content,
	Dropzone,
	List,
	Provider,
};

export { useFiles };
export type { FilesRef } from './Root';
