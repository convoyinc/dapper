// https://webpack.github.io/docs/hot-module-replacement.html#api
interface HMR {
  accept(dependencies: string[], callback: (updatedDependencies: string[]) => void): void;
  accept(dependency: string, callback: () => void): void;
  accept(errorHandler?: (error: Error) => void): void;

  decline(dependencies: string[]): void;
  decline(dependency: string): void;
  decline(): void;

  dispose(callback: () => void): void;
}

declare interface NodeModule {
  hot?: HMR;
}
