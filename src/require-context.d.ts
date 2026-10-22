// Webpack's require.context, which Remotion's bundler supports.
interface NodeRequire {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
  ): {
    keys(): string[];
    <T>(id: string): T;
  };
}
declare const require: NodeRequire;
