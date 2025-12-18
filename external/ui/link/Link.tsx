import { Anchor, type AnchorProps } from '@mantine/core';
import { createLink, type LinkComponent } from '@tanstack/react-router';
import { forwardRef } from 'react';
import classes from './styles.module.css';

const MantineLinkComponent = forwardRef<
	HTMLAnchorElement,
	Omit<AnchorProps, 'href'>
>((props, ref) => {
	return (
		<Anchor
			ref={ref}
			className={classes.root}
			c="inherit"
			underline="never"
			{...props}
		/>
	);
});

const CreatedLinkComponent = createLink(MantineLinkComponent);

export const Link: LinkComponent<typeof MantineLinkComponent> = (props) => {
	return <CreatedLinkComponent {...props} />;
};
