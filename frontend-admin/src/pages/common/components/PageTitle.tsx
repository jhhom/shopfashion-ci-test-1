import { IconAddThick } from "~/pages/common/Icons";

export function PageTitle(props: {
  title: string;
  description: string;
  icon?: JSX.Element;
}) {
  return (
    <div className="flex items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100/80">
        {props.icon ? (
          props.icon
        ) : (
          <IconAddThick className="h-9 w-9 text-teal-500" />
        )}
      </div>
      <div className="pl-4">
        <h1 className="text-2xl font-semibold">{props.title}</h1>
        <p className="text-sm text-gray-400">{props.description}</p>
      </div>
    </div>
  );
}
