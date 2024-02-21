import { useEffect, useRef, useState } from "react";
import { clsx as cx } from "clsx";
import {
  Control,
  Controller,
  FieldError,
  FieldPath,
  FieldValues,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import * as Collapsible from "@radix-ui/react-collapsible";
import { z } from "zod";
import { format, parse } from "date-fns";

import { OrdersTable } from "~/pages/Orders/OrdersListing/components";
import { PageTitle } from "~/pages/common/components/PageTitle";
import {
  IconShoppingCart,
  IconCaretDown,
  IconFilter,
  IconMagnifyingGlassThicker600Weight,
} from "~/pages/common/Icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  TablePagination,
  useTablePagination,
} from "~/pages/common/components/Table/TablePagination/Pagination";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";

const DATE_FORMAT = "yyyy-MM-dd";

import {
  useListOrders,
  type OrderFilter,
  useCancelOrder,
} from "~/pages/Orders/api";

export function OrdersListingPage() {
  const [orderFilter, setOrderFilter] = useState<OrderFilter>({
    dateFrom: undefined,
    dateTo: undefined,
    customerEmail: null,
    totalPriceGreaterThan: null,
    totalPriceLessThan: null,
  });
  const pagination = useTablePagination({
    pageNumber: 1,
    pageSize: 10,
  });

  const ordersQuery = useListOrders(orderFilter, pagination.pagination);

  const queryClient = useQueryClient();

  const cancelOrderMutation = useCancelOrder();

  if (ordersQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="display orders"
        failed="load orders' data"
      />
    );
  }

  if (!ordersQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <PageTitle
          title={"Orders"}
          description="Process your orders"
          icon={<IconShoppingCart className="h-6 w-6 text-teal-500" />}
        />
      </div>

      <Filter
        filter={orderFilter}
        onFilter={(f) => setOrderFilter(f)}
        marginTop="mt-8"
      />

      <TablePagination
        className="flex-grow py-7"
        pageSizeSelectClassName="w-[140px]"
        totalPages={ordersQuery.data.paginationMeta.totalPages}
        currentPage={pagination.currentPage}
        onGoToPage={pagination.onGotoPage}
        onPreviousPage={pagination.onPreviousPage}
        onNextPage={pagination.onNextPage}
        pageSize={pagination.pageSize}
        onChangePageSize={pagination.onChangePageSize}
      />

      <div className="mt-2 pb-16">
        <OrdersTable
          ordersData={ordersQuery.data.results}
          onCancelOrder={(id) => cancelOrderMutation.mutate(id)}
        />
      </div>
    </>
  );
}

const filterSchema = z.object({
  customerEmail: z.string(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  totalPriceGreaterThan: z
    .number({
      invalid_type_error: "Price should be a number",
    })
    .nullable(),
  totalPriceLessThan: z
    .number({
      invalid_type_error: "Price should be a number",
      coerce: true,
    })
    .nullable(),
});

type FilterSchema = z.infer<typeof filterSchema>;

export function Filter({
  filter,
  ...props
}: {
  onFilter: (filter: OrderFilter) => void;
  filter: OrderFilter;
  marginTop?: string;
}) {
  const [open, setOpen] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors: formErrors },
  } = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      customerEmail: filter.customerEmail ?? "",
      dateFrom: filter.dateFrom
        ? format(filter.dateFrom, DATE_FORMAT)
        : undefined,
      dateTo: filter.dateTo ? format(filter.dateTo, DATE_FORMAT) : undefined,
      totalPriceGreaterThan: filter.totalPriceGreaterThan ?? undefined,
      totalPriceLessThan: filter.totalPriceLessThan ?? undefined,
    },
  });

  return (
    <Collapsible.Root
      className={cx(props.marginTop)}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="bg-white">
        <Collapsible.Trigger asChild>
          <button className="flex h-12 w-full items-center rounded-t-md border border-gray-300 pl-4 text-sm font-semibold text-black">
            <span className="flex h-12 w-6 items-center justify-center">
              <IconCaretDown
                className={cx(
                  "duration-400 h-3.5 w-3.5  transition-transform",
                  { "rotate-0": open },
                  { "-rotate-90": !open }
                )}
              />
            </span>
            <span className="ml-1 flex h-12 w-5 items-center justify-center">
              <IconFilter className="h-5 w-5" />
            </span>
            <span className="ml-2">Filters</span>
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content className="data-[state=closed] overflow-hidden shadow-o-md duration-200 ease-out data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down">
        <form
          onSubmit={handleSubmit(
            (v) => {
              props.onFilter({
                ...v,
                dateFrom: v.dateFrom
                  ? parse(v.dateFrom, DATE_FORMAT, new Date())
                  : undefined,
                dateTo: v.dateTo
                  ? parse(v.dateTo, DATE_FORMAT, new Date())
                  : undefined,
              });
            },
            (e) => {
              alert("ERROR: " + JSON.stringify(e));
            }
          )}
          className="border border-t-0 border-gray-300 bg-white px-5 py-6 text-sm"
        >
          <div>
            <p>Customer Email</p>
            <input
              type="text"
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2"
              {...register("customerEmail")}
            />
          </div>

          <div className="mt-4 flex">
            <FilterDateField
              className="mt-1 basis-1/2 pr-2"
              control={control}
              name="dateFrom"
              label="Date from"
            />
            <FilterDateField
              className="mt-1 basis-1/2 pl-2"
              control={control}
              name="dateTo"
              label="Date to"
            />
          </div>

          <div className="mt-4 flex">
            <div className="basis-1/2 pr-2">
              <p>Total price | Greater than</p>
              <input
                type="text"
                className={cx(
                  "mt-1 w-full rounded-md border border-gray-300 px-2 py-2.5 outline-0 focus:ring-2 focus:ring-blue-500",
                  {
                    "ring-2 ring-red-500":
                      formErrors["totalPriceGreaterThan"] !== undefined,
                  }
                )}
                {...register("totalPriceGreaterThan", {
                  setValueAs: (v) =>
                    v === "" || Number.isNaN(v) ? null : parseFloat(v),
                })}
              />
              <div className="h-5 pt-1 text-red-500">
                {formErrors["totalPriceGreaterThan"]?.message}
              </div>
            </div>
            <div className="basis-1/2 pl-2">
              <p>Less than</p>
              <input
                type="text"
                className={cx(
                  "mt-1 w-full rounded-md border border-gray-300 px-2 py-2.5",
                  {
                    "ring-2 ring-red-500":
                      formErrors["totalPriceLessThan"] !== undefined,
                  }
                )}
                {...register("totalPriceLessThan", {
                  setValueAs: (v) =>
                    v === "" || Number.isNaN(v) ? null : parseFloat(v),
                })}
              />
              <div className="h-5 pt-1 text-red-500">
                {formErrors["totalPriceLessThan"]?.message}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="flex h-9 items-center rounded-md bg-blue-500 pl-2 pr-5 text-white"
            >
              <span className="flex h-9 w-8 items-center justify-center">
                <IconMagnifyingGlassThicker600Weight className="h-[1.125rem] w-[1.125rem]" />
              </span>
              <span>Filter</span>
            </button>
          </div>
        </form>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

type DateFieldProps<
  T extends React.Key,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = any
> = {
  label: string;
  name: TName;
  id?: string;
  error?: FieldError | undefined;
  className?: string;
  control: Control<TFieldValues, TContext>;
};

function FilterDateField<
  T extends React.Key,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = any
>({
  label,
  name,
  id,
  error,
  className,
  control,
}: DateFieldProps<T, TFieldValues, TName, TContext>) {
  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <input
              type="date"
              id={id}
              className="w-full rounded-md border border-gray-300 px-2 py-2.5"
              onBlur={field.onBlur}
              disabled={field.disabled}
              name={field.name}
              ref={field.ref}
              onChange={field.onChange}
              value={
                field.value
                  ? ((v: unknown) => {
                      if (v === undefined) {
                        return undefined;
                      }
                      if (v instanceof Date) {
                        return format(v, "yyyy-MM-dd");
                      }
                      if (typeof v === "string") {
                        return v;
                      }
                      return undefined;
                    })(field.value)
                  : undefined
              }
            />
          );
        }}
      />
      <p className="text-red-500">{error?.message}</p>
    </div>
  );
}
