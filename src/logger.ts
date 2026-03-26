const TRUNCATE_LEN = 80;

export function logToolCall(
  name: string,
  args: object,
  result: string
): void {
  const ts = new Date().toISOString();
  const truncated =
    result.length > TRUNCATE_LEN
      ? result.slice(0, TRUNCATE_LEN) + "..."
      : result;
  const paddedName = name.padEnd(14);
  console.log(
    `[${ts}] TOOL_CALL  ${paddedName} | args: ${JSON.stringify(args)} | result: "${truncated}"`
  );
}
