import * as React from 'react';
import { DetailsRowBase } from './DetailsRow.base';
import { CheckboxVisibility } from './DetailsList.types';
import { SelectionMode } from '../../Selection';
import { CollapseAllVisibility } from '../GroupedList/GroupedList.types';
import type { IStyle, ITheme } from '../../Styling';
import type { IColumn, IDetailsListProps } from './DetailsList.types';
import type { ISelection } from '../../Selection';
import type { IDragDropHelper, IDragDropEvents } from '../../DragDrop';
import type { IViewport } from '../../utilities/decorators/withViewport';
import type { IGroup } from '../GroupedList/GroupedList.types';
import type { IBaseProps, IRefObject, IStyleFunctionOrObject, IRenderFunction, IComponentAs } from '../../Utilities';
import type { IDetailsRowCheckProps, IDetailsCheckboxProps } from './DetailsRowCheck.types';
import type { IDetailsRowFieldsProps } from './DetailsRowFields.types';
import type { IFocusZoneProps } from '../../FocusZone';

/**
 * {@docCategory DetailsList}
 */
export interface IDetailsRow {}

/**
 * {@docCategory DetailsList}
 */
export interface IDetailsItemProps {
  /**
   * Column metadata
   */
  columns?: IColumn[];

  /**
   * Nesting depth of a grouping
   */
  groupNestingDepth?: number;

  /**
   * How much to indent
   */
  indentWidth?: number | undefined;

  /**
   * Selection from utilities
   */
  selection?: ISelection | undefined;

  /**
   * Selection mode
   */
  selectionMode?: SelectionMode | undefined;

  /**
   * Viewport of the virtualized list
   *
   * @deprecated Use `rowWidth` instead
   */
  viewport?: IViewport | undefined;

  /**
   * Checkbox visibility
   */
  checkboxVisibility?: CheckboxVisibility | undefined;

  /**
   * Rules for rendering column cells.
   */
  cellStyleProps?: ICellStyleProps;

  /**
   * Minimum width of the row.
   *
   * @defaultvalue 0
   */
  rowWidth?: number;
}

/**
 * {@docCategory DetailsList}
 */
export interface IDetailsRowBaseProps
  extends Pick<IDetailsListProps, 'onRenderItemColumn' | 'getCellValueKey' | 'onRenderField'>,
    IBaseProps<IDetailsRow>,
    IDetailsItemProps {
  /**
   * Theme provided by styled() function
   */
  theme?: ITheme;

  /**
   * Overriding styles to this row
   */
  styles?: IStyleFunctionOrObject<IDetailsRowStyleProps, IDetailsRowStyles>;

  /**
   * Ref of the component
   */
  componentRef?: IRefObject<IDetailsRow>;

  /**
   * Data source for this component
   */
  item: any;

  /**
   * Index of the collection of items of the DetailsList
   */
  itemIndex: number;

  /**
   * Offset used to calculate the aria-rowindex value based on itemIndex
   * @defaultvalue 2
   */
  flatIndexOffset?: number;

  /**
   * Whether to render in compact mode
   */
  compact?: boolean;

  /**
   * A list of events to register
   */
  eventsToRegister?: { eventName: string; callback: (item?: any, index?: number, event?: any) => void }[];

  /**
   * Callback for did mount for parent
   */
  onDidMount?: (row?: DetailsRowBase) => void;

  /**
   * Callback for will mount for parent
   */
  onWillUnmount?: (row?: DetailsRowBase) => void;

  /**
   * Callback for rendering a checkbox
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  onRenderCheck?: (props: IDetailsRowCheckProps) => JSX.Element;

  /**
   * If provided, can be used to render a custom checkbox
   */
  onRenderDetailsCheckbox?: IRenderFunction<IDetailsCheckboxProps>;

  /**
   * Handling drag and drop events
   */
  dragDropEvents?: IDragDropEvents;

  /**
   * Helper for the drag and drop
   */
  dragDropHelper?: IDragDropHelper;

  /**
   * Collapse all visibility
   */
  collapseAllVisibility?: CollapseAllVisibility;

  /**
   * Callback for getting the row aria label
   */
  getRowAriaLabel?: (item: any) => string;

  /**
   * Callback for getting the row aria description
   */
  getRowAriaDescription?: (item: any) => string;

  /**
   * Callback for getting the row aria-describedby
   */
  getRowAriaDescribedBy?: (item: any) => string;

  /**
   * Check button's aria label
   */
  checkButtonAriaLabel?: string;

  /**
   * Class name for the checkbox cell
   */
  checkboxCellClassName?: string;

  /**
   * DOM element into which to render row field
   */
  rowFieldsAs?: IComponentAs<IDetailsRowFieldsProps>;

  /**
   * Overriding class name
   */
  className?: string;

  /** Whether to animate updates */
  enableUpdateAnimations?: boolean;

  /**
   * Rerender DetailsRow only when props changed. Might cause regression when depending on external updates.
   * @defaultvalue false
   */
  useReducedRowRenderer?: boolean;
  /**
   * Optional pre-rendered content per column. Preferred over onRender or onRenderItemColumn if provided.
   */
  cellsByColumn?: {
    [columnKey: string]: React.ReactNode;
  };

  /**
   * Whether to use fast icon and check components. The icons can't be targeted by customization
   * but are still customizable via class names.
   * @defaultvalue true
   */
  useFastIcons?: boolean;

  /** Role for the row. */
  role?: string;

  /**
   * Whether the row is rendered within a grid.
   * In DetailsList this should be true, and in GroupedList this should be false.
   */
  isGridRow?: boolean;

  /**
   * Id for row
   */
  id?: string;

  /**
   * Group row item belongs to.
   * When using GroupedList, this needs to be passed in order to calculate
   * the correct aria-posinset and aria-setsize values.
   */
  group?: IGroup;

  /**
   * Properties to pass to the rows' FocusZone.
   */
  focusZoneProps?: IFocusZoneProps;

  /** whether or not row should be rendered in disabled state */
  disabled?: boolean;
}

/**
 * {@docCategory DetailsList}
 */
export interface IDetailsRowProps extends IDetailsRowBaseProps {
  /**
   * Column metadata
   */
  columns: IColumn[];

  /**
   * Selection from utilities
   */
  selection: ISelection;

  /**
   * Selection mode
   */
  selectionMode: SelectionMode;
}

/**
 * {@docCategory DetailsList}
 */
export type IDetailsRowStyleProps = Required<Pick<IDetailsRowProps, 'theme'>> &
  Pick<IDetailsRowProps, 'disabled'> & {
    /** Whether the row is selected  */
    isSelected?: boolean;

    /** Whether there are any rows in the list selected */
    anySelected?: boolean;

    /** Whether this row can be selected */
    canSelect?: boolean;

    /** Class name of when this becomes a drop target. */
    droppingClassName?: string;

    /** Is the checkbox visible */
    isCheckVisible?: boolean;

    /** Is this a row header */
    isRowHeader?: boolean;

    /** A class name from the checkbox cell, so proper styling can be targeted */
    checkboxCellClassName?: string;

    /** CSS class name for the component */
    className?: string;

    /** Is list in compact mode */
    compact?: boolean;

    cellStyleProps?: ICellStyleProps;

    /** Whether to animate updates */
    enableUpdateAnimations?: boolean;
  };

/**
 * {@docCategory DetailsList}
 */
export interface ICellStyleProps {
  cellLeftPadding: number;
  cellRightPadding: number;
  cellExtraRightPadding: number;
}

/**
 * {@docCategory DetailsList}
 */
export interface IDetailsRowStyles {
  root: IStyle;
  cell: IStyle;
  cellAnimation: IStyle;
  cellUnpadded: IStyle;
  cellPadded: IStyle;
  checkCell: IStyle;
  isRowHeader: IStyle;
  isMultiline: IStyle;
  fields: IStyle;
  cellMeasurer: IStyle;
  /**
   * @deprecated Node removed, do not use
   */
  checkCover?: IStyle;
  check: IStyle;
}
