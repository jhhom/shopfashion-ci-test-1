import {
  Button,
  ListBoxItem,
  Label,
  ListBox,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from "react-aria-components";
import { clsx as cx } from "clsx";
import { useEffect } from "react";
import { IconCaretDown } from "~/pages/common/Icons";

type SelectProps<T> = {
  options: { name: string; id: T }[];
  label?: string;
  marginTop?: string;
  width?: string;
  onChange?: (v: T) => void;
  disabled?: boolean | undefined;
  name?: string | undefined;
  onBlur?: (e: React.FocusEvent<Element, Element>) => void;
  mRef?: React.Ref<HTMLDivElement> | null;
  value?: T;
  defaultValue?: T;
};

export function Select<T extends React.Key>(props: SelectProps<T>) {
  return (
    <AriaSelect
      onSelectionChange={(v) => {
        if (props.onChange) {
          props.onChange(v as T);
        }
      }}
      // @ts-ignore
      defaultSelectedKey={props.defaultValue}
      // @ts-ignore
      selectedKey={props.value}
      className={cx(
        "w-[150px] bg-white text-sm focus:outline-none",
        props.marginTop,
        props.width
      )}
      isDisabled={props.disabled}
      name={props.name}
      onBlur={props.onBlur}
      ref={props.mRef}
    >
      {props.label && <Label>{props.label}</Label>}
      <Button
        className={cx(
          "relative flex h-10 w-[150px] items-center justify-between rounded-md border border-gray-300 focus:outline-none",
          props.width,
          { "mt-1": props.label !== undefined }
        )}
      >
        <SelectValue className="block pl-4 pr-1 text-left" />
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <IconCaretDown className="h-3 w-3 text-gray-500" />
        </span>
      </Button>
      <Popover
        className={cx(
          "w-[150px] bg-white text-sm transition",
          "duration-100 data-[entering]:animate-select-show data-[exiting]:animate-select-hide",
          props.width
        )}
      >
        <ListBox className="w-full space-y-1 rounded-md border border-gray-300 bg-white px-1 py-1">
          {props.options.map((o) => (
            <SelectItem key={o.id} id={o.id} item={o.name} />
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

function SelectItem<T extends React.Key>(props: { id: T; item: string }) {
  return (
    <ListBoxItem
      // @ts-ignore
      id={props.id}
      className="min-h-[2rem] w-full cursor-pointer rounded-md px-4 py-1.5 hover:bg-gray-100 focus:outline-none"
    >
      {(p) => props.item}
    </ListBoxItem>
  );
}
