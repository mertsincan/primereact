import { withComponent } from '@primereact/core/component';
import { style } from '@primereact/styles/card';
import { defaultProps } from './Card.props';

export const useCard = withComponent(
    ({ elementRef, id, props, parent, $primereact }) => {
        //@todo
    },
    defaultProps,
    style
);