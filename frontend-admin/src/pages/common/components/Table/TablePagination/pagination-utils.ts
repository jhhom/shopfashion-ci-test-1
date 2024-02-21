export type OutputItem =
  | {
      type: "break";
    }
  | {
      type: "page";
      page: number;
      active?: boolean;
    };

export function paginationToItems(props: {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}): OutputItem[] {
  let left = arrayRange(2, props.currentPage - 1, 1);
  let right = arrayRange(props.currentPage + 1, props.totalPages - 1, 1);

  // -1 means left break
  // 0 means right break

  const output = [1, props.totalPages, props.currentPage];

  const TOTAL_ITEMS_MINUS_1 = props.totalItems - 1;
  const TOTAL_ITEMS_MINUS_2 = props.totalItems - 2;

  if (props.totalItems < 3) {
    throw new Error("Total items have to be at least more than 2");
  }

  if (props.totalItems % 2 === 0) {
    throw new Error("Total items should be an odd number");
  }

  while (left.length !== 0 || right.length !== 0) {
    if (
      (left.length === 0 || right.length === 0) &&
      new Set(output).size === TOTAL_ITEMS_MINUS_1
    ) {
      if (left.length === 1) {
        output.push(left[0]);
      } else if (left.length > 1) {
        output.push(-1);
        left = [];
      }

      if (right.length === 1) {
        output.push(right[0]);
      } else if (right.length > 1) {
        output.push(0);
        right = [];
      }
    } else if (
      new Set(output).size === TOTAL_ITEMS_MINUS_2 &&
      left.length !== 0 &&
      right.length !== 0
    ) {
      if (left.length === 1) {
        const a = left.pop();
        if (a) {
          output.push(a);
        }
      } else if (left.length > 1) {
        output.push(-1);
        left = [];
      }

      if (right.length === 1) {
        const a = right.pop();
        if (a) {
          output.push(a);
        }
      } else if (right.length > 1) {
        output.push(0);
        right = [];
      }
    }

    if (left.length > 0) {
      const a = left.pop();
      if (a !== undefined) {
        output.push(a);
      }
    }
    if (right.length > 0) {
      const a = right.shift();
      if (a !== undefined) {
        output.push(a);
      }
    }
  }

  const outputSet = new Set(output);
  const leftBreak = outputSet.delete(-1);
  const rightBreak = outputSet.delete(0);

  const outputArr = Array.from(outputSet).sort((a, b) => a - b);

  if (leftBreak) {
    for (let i = 0; i < props.currentPage; i++) {
      // if there is still next item in the array
      if (i < outputArr.length - 1 && outputArr[i + 1] - outputArr[i] > 1) {
        outputArr.splice(i + 1, 0, 0);
        break;
      }
    }
  }

  if (rightBreak) {
    const currentCountIdx = outputArr.findIndex((x) => x === props.currentPage);
    if (currentCountIdx !== -1) {
      for (let i = currentCountIdx; i < outputArr.length; i++) {
        // if there is still next item in the array
        if (i < outputArr.length - 1 && outputArr[i + 1] - outputArr[i] > 1) {
          outputArr.splice(i + 1, 0, 0);
          break;
        }
      }
    }
  }

  return outputArr.map<OutputItem>((x) => {
    if (x === 0) {
      return { type: "break" };
    } else {
      return { type: "page", page: x, active: x === props.currentPage };
    }
  });
}

function arrayRange(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step,
  );
}
