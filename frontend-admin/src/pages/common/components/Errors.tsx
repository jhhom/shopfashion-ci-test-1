export function UnexpectedErrorMessage(props: {
  intent: string;
  failed: string;
}) {
  return (
    <div className="rounded-md border border-red-500 bg-red-100 px-4 py-4 text-red-600">
      {`Unable to ${props.intent}. An unexpected error occured while trying to ${props.failed}.`}
    </div>
  );
}

export function UnexpectedErrorMessages(props: {
  intent: string;
  errors: {
    error: unknown;
    action: string;
  }[];
}) {
  return (
    <div className="rounded-md border border-red-500 bg-red-100 px-4 py-4 text-red-600">
      {`Unable to ${props.intent}. Unexpected errors occured while trying to perform following actions:`}
      <ul className="mt-1.5">
        {props.errors.map((e) => {
          if (e.error === undefined || e.error === null) {
            return undefined;
          }
          return (
            <li className="list-inside list-disc" key={e.action}>
              {e.action}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ResourceNotFoundErrorMessage(props: { resource: string }) {
  return (
    <div className="w-full text-center flex justify-center items-center text-xl h-[240px] lg:h-[480px]">
      {props.resource} not found
    </div>
  );
}
