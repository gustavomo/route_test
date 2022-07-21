type TGetRouteFunction = () => TGetRouteRecord[];

type TTraceRouteFunction = (
  considererTraffic: boolean,
  newRoutes: TGetRouteRecord[],
  lastPoint?: number[], 
  astPointArray?: number[][],
) => TGetRouteRecord[];

type TGetRouteRecord = {
  delivery_location: number[];
  distance: number;
  id: number;
  pickup_location: number[];
  traffic: number;
}

type TGetStepsParams = {
  considerer_traffic: boolean;
  maximun_distance_between_points: number;
  maximun_distance: number;
  plot: boolean;
}
