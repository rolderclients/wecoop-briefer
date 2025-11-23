import { createTheme, Modal } from '@mantine/core';

export const theme = createTheme({
	components: {
		ModalTitle: Modal.Title.extend({
			defaultProps: { pr: 24 },
		}),
		ModalCloseButton: Modal.CloseButton.extend({
			defaultProps: {
				pos: 'absolute',
				top: 4,
				right: 4,
			},
		}),
	},
});
