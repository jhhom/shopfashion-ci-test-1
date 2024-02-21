import { Breadcrumb } from "~/pages/common/components/Breadcrumb/Breadcrumb";

export function CatchAllPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="">
        <Breadcrumb />
        <p className="mt-4 text-xl text-red-500">Error 404.</p>
        <p>
          Woops, we don't have this page, make sure that you check the URL is
          correct.
        </p>
      </div>
    </div>
  );
}
