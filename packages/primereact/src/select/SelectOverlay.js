import { Icon } from '@primereact/icons/base';
import { BlankIcon } from '@primereact/icons/blank';
import { CheckIcon } from '@primereact/icons/check';
import { SearchIcon } from '@primereact/icons/search';
import { classNames, isEmpty, mergeProps, resolve } from '@primeuix/utils';
import { CSSTransition } from 'primereact/csstransition';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Portal } from 'primereact/portal';
import { Ripple } from 'primereact/ripple';
import { VirtualScroller } from 'primereact/virtualscroller';
import * as React from 'react';

export const SelectOverlay = React.memo(
    React.forwardRef((inProps, inRef) => {
        const { select } = inProps;
        const {
            id,
            props,
            state,
            ptm,
            cx,
            // element refs
            overlayRef,
            filterInputRef,
            firstHiddenFocusableElementOnOverlayRef,
            lastHiddenFocusableElementOnOverlayRef,
            virtualScrollerRef,
            listRef,
            // methods
            getOptionIndex,
            getOptionLabel,
            isOptionDisabled,
            isOptionGroup,
            getOptionGroupLabel,
            getAriaPosInset,
            onFirstHiddenFocus,
            onLastHiddenFocus,
            onOptionSelect,
            onOptionMouseMove,
            onFilterChange,
            onFilterKeyDown,
            onFilterBlur,
            onOverlayClick,
            onOverlayKeyDown,
            onOverlayEnter,
            onOverlayEntered,
            onOverlayExit,
            onOverlayExited,
            isSelected,
            // computed
            visibleOptions,
            filterResultMessageText,
            emptyFilterMessageText,
            emptyMessageText,
            selectedMessageText,
            focusedOptionId,
            ariaSetSize,
            virtualScrollerDisabled
        } = select;

        const getPTItemOptions = (option, itemOptions, index, key) => {
            return ptm(key, {
                context: {
                    option,
                    index,
                    selected: isSelected(option),
                    focused: state.focusedOptionIndex === getOptionIndex(index, itemOptions),
                    disabled: isOptionDisabled(option)
                }
            });
        };

        const createLastHiddenFocusable = () => {
            const lastHiddenFocusableProps = mergeProps(
                {
                    role: 'presentation',
                    'aria-hidden': true,
                    className: 'p-hidden-accessible p-hidden-focusable',
                    tabIndex: 0,
                    onFocus: onLastHiddenFocus,
                    'data-p-hidden-accessible': true,
                    'data-p-hidden-focusable': true
                },
                ptm('hiddenLastFocusableEl')
            );

            return <span {...lastHiddenFocusableProps} ref={lastHiddenFocusableElementOnOverlayRef}></span>;
        };

        const createHiddenSelectedMessage = () => {
            const hiddenSelectedMessageProps = mergeProps(
                {
                    role: 'status',
                    'aria-live': 'polite',
                    className: 'p-hidden-accessible',
                    'data-p-hidden-accessible': true
                },
                ptm('hiddenSelectedMessage')
            );

            return <span {...hiddenSelectedMessageProps}>{selectedMessageText}</span>;
        };

        const createHiddenEmptyMessage = () => {
            if (isEmpty(props.options)) {
                const hiddenEmptyMessageProps = mergeProps(
                    {
                        role: 'status',
                        'aria-live': 'polite',
                        className: 'p-hidden-accessible',
                        'data-p-hidden-accessible': true
                    },
                    ptm('hiddenEmptyMessage')
                );

                return <span {...hiddenEmptyMessageProps}>{emptyMessageText}</span>;
            }

            return null;
        };

        const createEmptyMessage = (items) => {
            const commonEmptyMessageProps = mergeProps(
                {
                    className: cx('emptyMessage'),
                    role: 'option',
                    'data-p-hidden-accessible': true
                },
                ptm('emptyMessage')
            );

            if (isEmpty(items)) {
                if (state.filterValue) {
                    return <li {...commonEmptyMessageProps}>{resolve(props.emptyFilter) || emptyFilterMessageText}</li>;
                }

                return <li {...commonEmptyMessageProps}>{resolve(props.emptyMessage) || emptyMessageText}</li>;
            }

            return null;
        };

        const createListItem = (option, options) => {
            const { itemSize, index, optionGroup, getItemOptions } = options;

            if (isOptionGroup(option)) {
                const optionGroupLabelProps = mergeProps({ className: cx('optionGroupLabel') }, ptm('optionGroupLabel'));
                const content = resolve(props.optionGroupTemplate, { option: optionGroup, index }) || <span {...optionGroupLabelProps}>{getOptionGroupLabel(optionGroup)}</span>;

                const optionGroupProps = mergeProps(
                    {
                        id: id + '_' + index,
                        style: { height: itemSize ? itemSize + 'px' : undefined },
                        className: cx('optionGroup'),
                        role: 'option'
                    },
                    ptm('optionGroup')
                );

                return <li {...optionGroupProps}>{content}</li>;
            }

            const selected = isSelected(option);
            const disabled = isOptionDisabled(option);
            const label = getOptionLabel(option);

            const optionLabelProps = mergeProps(
                {
                    className: cx('optionLabel')
                },
                ptm('optionLabel')
            );

            const content = resolve(props.optionTemplate, { option, selected, index }) || <span {...optionLabelProps}>{label}</span>;

            const checkmarkKey = selected ? 'optionCheckIcon' : 'optionBlankIcon';
            const checkmark = <Icon pIf={props.checkmark} as={selected ? <CheckIcon /> : <BlankIcon />} {...mergeProps({ className: cx(checkmarkKey) }, ptm(checkmarkKey))} />;

            const optionProps = mergeProps(
                {
                    id: id + '_' + index,
                    className: classNames(cx('option', { option, focusedOption: index })), // @todo: focusedOption ??
                    style: { height: itemSize ? itemSize + 'px' : undefined },
                    role: 'option',
                    'aria-label': label,
                    'aria-selected': selected,
                    'aria-disabled': disabled,
                    'aria-setsize': ariaSetSize,
                    'aria-posinset': getAriaPosInset(index),
                    onClick: (event) => onOptionSelect(event, option),
                    onMouseMove: (event) => onOptionMouseMove(event, index),
                    'data-p-selected': selected,
                    'data-p-focused': state.focusedOptionIndex === index,
                    'data-p-disabled': disabled
                },
                getPTItemOptions(option, getItemOptions, index, 'option')
            );

            return (
                <li {...optionProps}>
                    {checkmark}
                    {content}
                    <Ripple />
                </li>
            );
        };

        const createListContent = (options) => {
            const { contentRef, style, className, children: content, items } = options;
            //listRef.current = contentRef.current; @todo

            const emptyMessage = createEmptyMessage(items);

            const listProps = mergeProps(
                {
                    id: id + '_list',
                    style,
                    className: classNames(cx('list'), className),
                    role: 'listbox'
                },
                ptm('list')
            );

            return (
                <ul {...listProps} ref={listRef}>
                    {content}
                    {emptyMessage}
                </ul>
            );
        };

        const createList = () => {
            const listContainerProps = mergeProps(
                {
                    style: { maxHeight: virtualScrollerDisabled ? props.scrollHeight : '' },
                    className: cx('listContainer')
                },
                ptm('listContainer')
            );

            const onLazyLoad = (event) => props.virtualScrollerOptions.onLazyLoad?.({ ...event, ...{ filter: props.filterValue } });

            return (
                <div {...listContainerProps}>
                    <VirtualScroller
                        {...props.virtualScrollerOptions}
                        ref={virtualScrollerRef}
                        items={visibleOptions}
                        style={{ ...props.virtualScrollerOptions?.style, ...{ height: props.scrollHeight } }}
                        tabIndex={-1}
                        disabled={virtualScrollerDisabled}
                        autoSize={true}
                        contentTemplate={createListContent}
                        itemTemplate={createListItem}
                        loadingTemplate={props.loader}
                        onLazyLoad={onLazyLoad}
                        pt={ptm('virtualScroller')}
                    />
                </div>
            );
        };

        const createFilter = () => {
            if (props.filter) {
                const hiddenFilterResultProps = mergeProps(
                    {
                        role: 'status',
                        'aria-live': 'polite',
                        className: 'p-hidden-accessible',
                        'data-p-hidden-accessible': true
                    },
                    ptm('hiddenFilterResult')
                );

                const filterProps = mergeProps(
                    {
                        className: cx('header')
                    },
                    ptm('header')
                );

                return (
                    <div {...filterProps}>
                        <IconField unstyled={props.unstyled} pt={ptm('pcFilterContainer')}>
                            <InputText
                                ref={filterInputRef}
                                type="text"
                                value={state.filterValue || ''}
                                className={cx('pcFilter')}
                                placeholder={props.filterPlaceholder}
                                variant={props.variant}
                                unstyled={props.unstyled}
                                role="searchbox"
                                autoComplete="off"
                                aria-owns={id + '_list'}
                                aria-activedescendant={focusedOptionId}
                                onKeyDown={onFilterKeyDown}
                                onBlur={onFilterBlur}
                                onChange={onFilterChange}
                                pt={ptm('pcFilter')}
                            />
                            <InputIcon unstyled={props.unstyled} pt={ptm('pcFilterIconContainer')}>
                                <Icon as={props.filterIcon || <SearchIcon />} {...ptm('filterIcon')} />
                            </InputIcon>
                        </IconField>
                        <span {...hiddenFilterResultProps}>{filterResultMessageText}</span>
                    </div>
                );
            }

            return null;
        };

        const createFirstHiddenFocusable = () => {
            const firstHiddenFocusableProps = mergeProps(
                {
                    role: 'presentation',
                    'aria-hidden': true,
                    className: 'p-hidden-accessible p-hidden-focusable',
                    tabIndex: 0,
                    onFocus: onFirstHiddenFocus,
                    'data-p-hidden-accessible': true,
                    'data-p-hidden-focusable': true
                },
                ptm('hiddenFirstFocusableEl')
            );

            return <span {...firstHiddenFocusableProps} ref={firstHiddenFocusableElementOnOverlayRef}></span>;
        };

        const firstHiddenFocusable = createFirstHiddenFocusable();
        const header = resolve(props.header, { value: props.value, options: visibleOptions });
        const filter = createFilter();
        const list = createList();
        const footer = resolve(props.footer, { value: props.value, options: visibleOptions });
        const hiddenEmptyMessage = createHiddenEmptyMessage();
        const hiddenSelectedMessage = createHiddenSelectedMessage();
        const lastHiddenFocusable = createLastHiddenFocusable();

        const overlayProps = mergeProps(
            {
                style: props.overlayStyle,
                className: classNames(cx('overlay'), props.overlayClassName),
                onClick: onOverlayClick,
                onKeyDown: onOverlayKeyDown
            },
            ptm('overlay')
        );

        const transitionProps = mergeProps(
            {
                classNames: 'p-connected-overlay',
                in: state.overlayVisible,
                timeout: { enter: 120, exit: 100 },
                options: props.transitionOptions,
                unmountOnExit: true,
                onEnter: onOverlayEnter,
                onEntered: onOverlayEntered,
                onExit: onOverlayExit,
                onExited: onOverlayExited
            },
            ptm('transition')
        );

        return (
            <Portal appendTo={props.appendTo}>
                <CSSTransition {...transitionProps} nodeRef={overlayRef}>
                    <div {...overlayProps} ref={overlayRef}>
                        {firstHiddenFocusable}
                        {header}
                        {filter}
                        {list}
                        {footer}
                        {hiddenEmptyMessage}
                        {hiddenSelectedMessage}
                        {lastHiddenFocusable}
                    </div>
                </CSSTransition>
            </Portal>
        );
    })
);

SelectOverlay.displayName = 'SelectOverlay';