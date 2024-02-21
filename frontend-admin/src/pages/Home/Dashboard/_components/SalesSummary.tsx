import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  PointElement,
  LineElement,
  ChartOptions,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { PageTitle } from "~/pages/common/components/PageTitle";
import { IconCalendar, IconChevronRight } from "~/pages/common/Icons";
import { clsx as cx } from "clsx";
import { useMemo, useState } from "react";
import { SalesGraphPeriod } from "@api-contract/common";
import { Duration, add, format, isToday, sub } from "date-fns";
import { AdminDashboardResponse } from "@api-contract/admin-api/types";
import { formatPrice } from "~/utils/utils";

export const options: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  elements: {
    line: {
      cubicInterpolationMode: "monotone",
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          if (typeof context.raw === "number") {
            context.formattedValue = "RM" + context.raw.toFixed(2);
          }
        },
      },
    },
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export function SalesSummary({
  period,
  setPeriod,
  date,
  setDate,
  className,
  data,
}: {
  period: SalesGraphPeriod;
  setPeriod: React.Dispatch<React.SetStateAction<SalesGraphPeriod>>;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  data: AdminDashboardResponse["salesGraph"]["body"];
  className?: string;
}) {
  const graph: ChartData<
    "line",
    (number | [number, number] | null)[],
    unknown
  > = useMemo(() => {
    return {
      labels:
        data.salesAmount.map((a) =>
          formatGraphDate(new Date(a.date), period),
        ) ?? [],

      datasets: [
        {
          label: "Sales amount",
          data: data.salesAmount.map((d) => d.amount) ?? [],
          borderWidth: 2,
          backgroundColor: "rgba(20, 184, 166, 0.2)",
          borderColor: "#14b8a6",
        },
      ],
    };
  }, [data]);

  return (
    <div
      className={cx(
        "rounded-sm border border-gray-200 bg-white shadow-o-sm",
        className,
      )}
    >
      <div className="block h-24 border-b border-gray-200 text-sm md:flex md:h-16 md:flex-row md:items-center md:justify-between md:px-5">
        <p className="mt-4 pl-8 font-semibold md:mt-0 md:pl-0">Sales summary</p>
        <div className="mt-4 flex pl-8 md:mt-0 md:pl-0">
          <Button
            text="2 Weeks"
            active={period === "TWO_WEEKS"}
            onClick={() => setPeriod("TWO_WEEKS")}
          />
          <Button
            text="Month"
            active={period === "MONTH"}
            onClick={() => setPeriod("MONTH")}
          />
          <Button
            text="Year"
            active={period === "YEAR"}
            onClick={() => setPeriod("YEAR")}
          />
        </div>
      </div>

      <OverviewStats
        totalSales={data.totalSales}
        numOfPaidOrders={data.numOfPaidOrders}
        numOfCustomers={data.numOfCustomers}
        avgOrderValue={data.avgOrderValue}
      />
      <div className="flex justify-end px-8 py-4 text-sm">
        <div className="flex items-center border border-gray-200 bg-gray-100 px-2 py-1.5">
          <IconCalendar className="h-4 w-4 text-gray-600" />
          <span className="ml-3.5">
            {format(new Date(data.meta.start), "yyyy-MM-dd")}&nbsp;{" "}
            <span className="text-[0.8rem]">to</span>&nbsp;{" "}
            {format(new Date(data.meta.end), "yyyy-MM-dd")}
          </span>
        </div>
      </div>

      <Graph
        onPrevious={() => setDate((d) => sub(d, durationOfPeriod(period)))}
        onNext={() => setDate((d) => add(d, durationOfPeriod(period)))}
        hideNext={isToday(date)}
        data={graph}
      />
    </div>
  );
}

function formatGraphDate(d: Date, period: SalesGraphPeriod): string {
  if (period === "YEAR") {
    return format(d, "MMM y");
  } else if (period === "TWO_WEEKS") {
    return format(d, "d.MMM");
  }

  return format(d, "d.MMM");
}

function durationOfPeriod(period: SalesGraphPeriod): Duration {
  if (period === "YEAR") {
    return {
      years: 1,
    };
  } else if (period === "TWO_WEEKS") {
    return {
      weeks: 2,
    };
  }

  return {
    months: 1,
  };
}

function Graph(props: {
  onPrevious: () => void;
  onNext: () => void;
  hideNext?: boolean;
  data: ChartData<"line", (number | [number, number] | null)[], unknown>;
}) {
  return (
    <div className="mx-auto flex max-h-[800px] max-w-[1100px] px-5 pb-8 pt-8">
      <div className="flex w-14 items-center self-stretch pr-4">
        <button
          onClick={props.onPrevious}
          className="text-gray-400 hover:text-gray-600"
        >
          <IconChevronRight className="h-10 w-10 rotate-180" />
        </button>
      </div>
      <div className="flex-grow overflow-x-auto">
        <div className="flex min-w-[40rem] justify-center md:min-h-[26rem]">
          {/* @ts-ignore */}
          <Line options={options} data={props.data} />
        </div>
      </div>

      <div className="flex w-14 items-center self-stretch pl-4">
        <button
          onClick={props.onNext}
          className={cx("text-gray-400 hover:text-gray-600", {
            hidden: props.hideNext,
          })}
        >
          <IconChevronRight className="h-10 w-10" />
        </button>
      </div>
    </div>
  );
}

function OverviewStats(props: {
  totalSales: number;
  numOfPaidOrders: number;
  numOfCustomers: number;
  avgOrderValue: number;
}) {
  return (
    <div className="block border-b border-gray-200 md:flex md:h-20">
      <OverviewStat
        value={`RM ${formatPrice(props.totalSales)}`}
        title="sales"
      />
      <OverviewStat
        value={props.numOfPaidOrders.toString()}
        title="paid orders"
      />
      <OverviewStat value={props.numOfCustomers.toString()} title="customers" />
      <OverviewStat
        value={`RM ${formatPrice(props.avgOrderValue)}`}
        title="average order value"
      />
    </div>
  );
}

function OverviewStat(props: { value: string; title: string }) {
  return (
    <div
      className="flex h-full flex-grow items-center justify-center border-b 
    border-gray-200 py-4 text-center last:border-b-0 
    md:border-b-0 md:border-r md:py-0 md:last:border-r-0"
    >
      <div>
        <p className="text-2xl">{props.value}</p>
        <p className="text-sm font-medium uppercase">{props.title}</p>
      </div>
    </div>
  );
}

function Button(props: {
  text: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cx("py- rounded-sm px-4 py-2", {
        "text-gray-500 hover:bg-gray-100": !props.active,
        "bg-gray-100 text-teal-600": props.active,
      })}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
