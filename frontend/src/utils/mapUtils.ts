import { Region } from "react-native-maps";
import SuperCluster from "supercluster";

export const regionToBBox = (r: Region): [number, number, number, number] => [
  r.longitude - r.longitudeDelta / 2,
  r.latitude - r.latitudeDelta / 2,
  r.longitude + r.longitudeDelta / 2,
  r.latitude + r.latitudeDelta / 2,
];

export const regionToZoom = (r: Region): number =>
  Math.round(Math.log(360 / r.longitudeDelta) / Math.LN2);

export const isClusterFeature = (
  f:
    | SuperCluster.ClusterFeature<SuperCluster.ClusterProperties>
    | SuperCluster.PointFeature<{ pinId: string }>
): f is SuperCluster.ClusterFeature<SuperCluster.ClusterProperties> =>
  (f as SuperCluster.ClusterFeature<SuperCluster.ClusterProperties>).properties
    .cluster === true;
