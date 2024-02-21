import { IconInfoCircle } from "~/pages/common/Icons";

export function NoResultIndicator() {
  return (
    <div className="flex items-center border border-blue-300 bg-blue-50 py-2.5 pl-5">
      <IconInfoCircle className="h-10 w-10 text-blue-600" />
      <div className="pl-8">
        <p className="font-bold text-blue-700">Info</p>
        <p className="text-sm">There are no results to display</p>
      </div>
    </div>
  );
}
