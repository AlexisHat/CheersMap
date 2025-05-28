import { useEffect, useMemo, useRef } from "react";
import SuperCluster from "supercluster";
import { Region } from "react-native-maps";
import { Pin, ClusterPoint } from "../types/mapTypes";
import { regionToBBox, regionToZoom, isClusterFeature } from "../utils/mapUtils";

export const useClusters = (pins: Pin[], region: Region): ClusterPoint[] => {
    const indexRef = useRef<SuperCluster<
      { pinId: string },
      SuperCluster.ClusterProperties
    > | null>(null);
  
    useEffect(() => {
      const index = new SuperCluster<
        { pinId: string },
        SuperCluster.ClusterProperties
      >({
        radius: 60,
        maxZoom: 20,
      });
  
      index.load(
        pins.map((pin) => ({
          type: "Feature" as const,
          properties: { pinId: pin.id },
          geometry: {
            type: "Point" as const,
            coordinates: [pin.longitude, pin.latitude],
          },
        }))
      );
  
      indexRef.current = index;
    }, [pins]);
  
    return useMemo(() => {
      if (!indexRef.current) return [];
  
      const bbox = regionToBBox(region);
      const zoom = regionToZoom(region);
  
      return indexRef.current.getClusters(bbox, zoom).map<ClusterPoint>((cluster) => {
        if (isClusterFeature(cluster)) {
          const clusterId = cluster.id as number;
          if (!indexRef.current) return [];
          const leaves = indexRef.current
            .getLeaves(clusterId, Infinity)
            .map((leaf) => pins.find((p) => p.id === leaf.properties.pinId)!)
            .filter(Boolean);
  
          return {
            id: `cluster_${clusterId}`,
            latitude: cluster.geometry.coordinates[1],
            longitude: cluster.geometry.coordinates[0],
            pointCount: cluster.properties.point_count,
            clusteredPins: leaves,
          };
        }
  
        const pinId = (cluster.properties as { pinId: string }).pinId;
        const pin = pins.find((p) => p.id === pinId);
        if (!pin) return null as any; // sollte durch .filter(Boolean) rausfliegen
        return {
          id: pin.id,
          latitude: pin.latitude,
          longitude: pin.longitude,
          pointCount: 1,
          pin,
        };
      }).filter(Boolean);
    }, [region, pins]);
  };