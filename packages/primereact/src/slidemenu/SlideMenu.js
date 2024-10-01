import { ComponentProvider } from '@primereact/core/component';
import { ESC_KEY_HANDLING_PRIORITIES, useDisplayOrder, useGlobalOnEscapeKey, useMountEffect, useOverlayListener, useUnmountEffect, useUpdateEffect } from '@primereact/hooks';
import { ChevronLeftIcon } from '@primereact/icons/chevronleft';
import { CSSTransition } from 'primereact/csstransition';
import { OverlayService } from 'primereact/overlayservice';
import { Portal } from 'primereact/portal';
import * as React from 'react';
import PrimeReact from '../api/Api';
import { DomHandler, IconUtils, UniqueComponentId, ZIndexUtils, classNames } from '../utils/Utils';
import { useSlideMenu } from './SlideMenu.base';
import { SlideMenuBase } from './SlideMenuBase';
import { SlideMenuSub } from './SlideMenuSub';

export const SlideMenu = React.memo(
    React.forwardRef((inProps, inRef) => {
        const [idState, setIdState] = React.useState(props.id);
        const [levelState, setLevelState] = React.useState(0);
        const [visibleState, setVisibleState] = React.useState(false);
        const state = {
            id: idState,
            visible: visibleState,
            level: levelState
        };

        const slidemenu = useSlideMenu(inProps, inRef, state);
        const { props, ptm, ptmi, cx, ref } = slidemenu;

        const menuRef = React.useRef(null);
        const targetRef = React.useRef(null);
        const backward = React.useRef(null);
        const slideMenuContent = React.useRef(null);
        const isCloseOnEscape = visibleState && props.popup && props.closeOnEscape;
        const slideMenuDisplayOrder = useDisplayOrder('slide-menu', isCloseOnEscape);

        useGlobalOnEscapeKey({
            callback: (event) => {
                hide(event);
            },
            when: isCloseOnEscape && slideMenuDisplayOrder,
            priority: [ESC_KEY_HANDLING_PRIORITIES.SLIDE_MENU, slideMenuDisplayOrder]
        });

        const [bindOverlayListener, unbindOverlayListener] = useOverlayListener({
            target: targetRef,
            overlay: menuRef,
            listener: (event, { valid }) => {
                valid && hide(event);
            },
            when: visibleState
        });

        const onPanelClick = (event) => {
            if (props.popup) {
                OverlayService.emit('overlay-click', {
                    originalEvent: event,
                    target: targetRef.current
                });
            }
        };

        const navigateForward = () => {
            setLevelState((prevLevel) => prevLevel + 1);
        };

        const navigateBack = () => {
            setLevelState((prevLevel) => prevLevel - 1);
        };

        const toggle = (event) => {
            if (props.popup) {
                visibleState ? hide(event) : show(event);
            }
        };

        const show = (event) => {
            targetRef.current = event.currentTarget;
            setVisibleState(true);
            props.onShow && props.onShow(event);
        };

        const hide = (event) => {
            targetRef.current = event.currentTarget;
            setVisibleState(false);
            props.onHide && props.onHide(event);
        };

        const onEnter = () => {
            if (props.autoZIndex) {
                ZIndexUtils.set('menu', menuRef.current, (context && context.autoZIndex) || PrimeReact.autoZIndex, props.baseZIndex || (context && context.zIndex.menu) || PrimeReact.zIndex.menu);
            }

            DomHandler.addStyles(menuRef.current, { position: 'absolute', top: '0', left: '0' });
            DomHandler.absolutePosition(menuRef.current, targetRef.current);
        };

        const onEntered = () => {
            bindOverlayListener();
        };

        const onExit = () => {
            targetRef.current = null;
            unbindOverlayListener();
        };

        const onExited = () => {
            ZIndexUtils.clear(menuRef.current);
            setLevelState(0);
        };

        useMountEffect(() => {
            if (!idState) {
                setIdState(UniqueComponentId());
            }
        });

        useUpdateEffect(() => {
            setLevelState(0);
        }, [props.model]);

        useUpdateEffect(() => {
            props.onNavigate && props.onNavigate({ level: levelState });
        }, [levelState]);

        useUnmountEffect(() => {
            ZIndexUtils.clear(menuRef.current);
        });

        React.useImperativeHandle(ref, () => ({
            props,
            toggle,
            show,
            hide,
            navigateForward,
            navigateBack,
            setLevelState,
            getElement: () => menuRef.current
        }));

        const createBackward = () => {
            const previousIconProps = mergeProps(
                {
                    className: cx('previousIcon')
                },
                ptm('previousIcon')
            );
            const icon = props.backIcon || <ChevronLeftIcon {...previousIconProps} />;
            const backIcon = IconUtils.getJSXIcon(icon, { ...previousIconProps }, { props });
            const previousLabelProps = mergeProps(ptm('previousLabel'));
            const previousProps = mergeProps(
                {
                    ref: backward,
                    className: cx('previous', { levelState }),
                    onClick: (e) => navigateBack(e)
                },
                ptm('previous')
            );

            return (
                <div {...previousProps}>
                    {backIcon}
                    <span {...previousLabelProps}>{props.backLabel}</span>
                </div>
            );
        };

        const createElement = () => {
            const wrapperStyle = { height: props.viewportHeight + 'px' };
            const backward = createBackward();
            const rootProps = mergeProps(
                {
                    ref: menuRef,
                    id: props.id,
                    className: classNames(props.className, cx('root')),
                    style: props.style,
                    onClick: (e) => onPanelClick(e)
                },
                SlideMenuBase.getOtherProps(props),
                ptm('root')
            );

            const wrapperProps = mergeProps(
                {
                    className: cx('wrapper'),
                    style: wrapperStyle
                },
                ptm('wrapper')
            );

            const contentProps = mergeProps(
                {
                    ref: slideMenuContent,
                    className: cx('content')
                },
                ptm('content')
            );

            const transitionProps = mergeProps(
                {
                    classNames: cx('transition'),
                    in: !props.popup || visibleState,
                    timeout: { enter: 120, exit: 100 },
                    options: props.transitionOptions,
                    unmountOnExit: true,
                    onEnter,
                    onEntered,
                    onExit,
                    onExited
                },
                ptm('transition')
            );

            return (
                <CSSTransition nodeRef={menuRef} {...transitionProps}>
                    <div {...rootProps}>
                        <div {...wrapperProps}>
                            <div {...contentProps}>
                                <SlideMenuSub
                                    id={idState}
                                    hostName="SlideMenu"
                                    menuProps={props}
                                    model={props.model}
                                    root
                                    index={0}
                                    menuWidth={props.menuWidth}
                                    effectDuration={props.effectDuration}
                                    level={levelState}
                                    parentActive={levelState === 0}
                                    onForward={navigateForward}
                                    submenuIcon={props.submenuIcon}
                                    ptm={ptm}
                                    cx={cx}
                                    sx={sx}
                                />
                            </div>
                        </div>
                        {backward}
                    </div>
                </CSSTransition>
            );
        };

        const element = createElement();

        return (
            <ComponentProvider pIf={props.pIf} value={slidemenu}>
                {props.popup ? <Portal element={element} appendTo={props.appendTo} /> : element}
            </ComponentProvider>
        );
    })
);

SlideMenu.displayName = 'SlideMenu';