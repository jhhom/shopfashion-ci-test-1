function containsOnlyAlphanumericDashesAndSpaces(inputString: string) {
  // Define a regular expression pattern that matches alphanumeric characters, dashes, and spaces
  const pattern = /^[a-zA-Z0-9\- ]+$/;

  // Use the test method to check if the input string matches the pattern
  return pattern.test(inputString);
}

const file2Base64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString() || "");
    reader.onerror = (error) => reject(error);
  });
};

function setHasAllElements(s: Set<number>, els: number[]) {
  for (const e of els) {
    if (!s.has(e)) {
      return false;
    }
  }
  return true;
}

function formatPrice(p: number) {
  return p.toFixed(2);
}

export {
  file2Base64,
  containsOnlyAlphanumericDashesAndSpaces,
  setHasAllElements,
  formatPrice,
};
