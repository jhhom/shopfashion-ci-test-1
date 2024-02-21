export function PageDoesNotExist() {
  return (
    <div
      id="page-does-not-exist"
      className="flex min-h-[inherit] items-center justify-center"
    >
      <div className="text-center">
        <p>Page does not exist</p>

        <p>Oops, make sure the URL you entered is correct.</p>
      </div>
    </div>
  );
}

export function UnexpectedError() {
  return (
    <div className="flex min-h-[inherit] items-center justify-center">
      <div className="text-center">
        <p>Uh oh, an unexpected error had occured!</p>

        <p>Sorry, we really didn't foresee this.</p>

        <p>
          We have been notified and will try to fix the error as soon as
          possible.
        </p>
      </div>
    </div>
  );
}

export function MissingProductImage() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600">
      No image
    </div>
  );
}
