import { ComponentProvider } from '@primereact/core/component';
import { addClass, classNames, isNotEmpty, mergeProps, removeClass } from '@primeuix/utils';
import { KeyFilter } from 'primereact/keyfilter';
import { Tooltip } from 'primereact/tooltip';
import * as React from 'react';
import { useInputText } from './InputText.base';

export const InputText = React.memo(
    React.forwardRef((inProps, inRef) => {
        const inputtext = useInputText(inProps, inRef);
        const { props, attrs, ptm, ptmi, cx, ref } = inputtext;

        const pcFluid = {}; // @todo: check Fluid component

        const onKeyDown = (event) => {
            props.onKeyDown && props.onKeyDown(event);

            if (props.keyfilter) {
                KeyFilter.onKeyPress(event, props.keyfilter, props.validateOnly);
            }
        };

        const onBeforeInput = (event) => {
            props.onBeforeInput && props.onBeforeInput(event);

            if (props.keyfilter) {
                KeyFilter.onBeforeInput(event, props.keyfilter, props.validateOnly);
            }
        };

        const onInput = (event) => {
            const target = event.target;
            let validatePattern = true;

            if (props.keyfilter && props.validateOnly) {
                validatePattern = KeyFilter.validate(event, props.keyfilter);
            }

            props.onInput && props.onInput(event, validatePattern);

            // for uncontrolled changes
            isNotEmpty(target.value) ? addClass(target, 'p-filled') : removeClass(target, 'p-filled');
        };

        const onPaste = (event) => {
            props.onPaste && props.onPaste(event);

            if (props.keyfilter) {
                KeyFilter.onPaste(event, props.keyfilter, props.validateOnly);
            }
        };

        const isFilled = React.useMemo(() => isNotEmpty(props.value) || isNotEmpty(props.defaultValue), [props.value, props.defaultValue]);
        const hasFluid = isEmpty(props.fluid) ? !!pcFluid : props.fluid;
        const hasTooltip = isNotEmpty(props.tooltip);

        const rootProps = mergeProps(
            {
                ref,
                type: 'text',
                style: props.style,
                className: classNames(cx('root'), props.className),
                'aria-invalid': invalid || undefined,
                onBeforeInput,
                onInput,
                onKeyDown,
                onPaste
            },
            ptmi('root', {
                context: {
                    filled: isFilled,
                    disabled: attrs.disabled || attrs.disabled === ''
                }
            })
        );

        return (
            <ComponentProvider value={inputtext}>
                <input {...rootProps} />
                {hasTooltip && <Tooltip target={ref} content={props.tooltip} pt={ptm('tooltip')} {...props.tooltipOptions} />}
            </ComponentProvider>
        );
    })
);

InputText.displayName = 'InputText';