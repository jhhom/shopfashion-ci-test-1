const envIndex = process.argv.indexOf("--env");

let envValue;

if (envIndex > -1) {
  // Retrieve the value after --custom
  envValue = process.argv[envIndex + 1];
}

console.log(envValue);
