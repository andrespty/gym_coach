export interface PlateSetup {
  barWeight: number;
  /** Plate sizes available, in the same unit as the bar. One entry per size; pairs assumed unlimited. */
  plateSizes: readonly number[];
}

export const STANDARD_LB_SETUP: PlateSetup = {
  barWeight: 45,
  plateSizes: [45, 35, 25, 10, 5, 2.5],
};
export const STANDARD_KG_SETUP: PlateSetup = {
  barWeight: 20,
  plateSizes: [25, 20, 15, 10, 5, 2.5, 1.25],
};

export interface PlateLoad {
  /** Plates for one side of the bar, heaviest first. */
  perSide: number[];
  /** Total weight actually loaded (may be below the target if it isn't loadable). */
  total: number;
}

/** Greedy plate math: the heaviest load not exceeding `target` that the setup can build. */
export function platesForTarget(target: number, setup: PlateSetup): PlateLoad {
  const sizes = [...setup.plateSizes].sort((a, b) => b - a);
  let remainingPerSide = Math.max(0, (target - setup.barWeight) / 2);
  const perSide: number[] = [];

  for (const size of sizes) {
    while (remainingPerSide + 1e-9 >= size) {
      perSide.push(size);
      remainingPerSide -= size;
    }
  }

  const loadedPerSide = perSide.reduce((sum, plate) => sum + plate, 0);
  return { perSide, total: setup.barWeight + loadedPerSide * 2 };
}
