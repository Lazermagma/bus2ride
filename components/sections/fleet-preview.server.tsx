import { getVehiclesByType, VehicleData } from "@/lib/data/vehicles";
import { FleetPreviewRotating } from "./fleet-preview-rotating.client";

export async function FleetPreviewServer({
  title,
  viewAllLink,
  type,
  amenityMode = "link",
  compact = false,
  hideButtons = false,
  isFleetPage = false,
}: {
  title: string;
  viewAllLink: string;
  type: VehicleData["type"];
  amenityMode?: "link" | "badge";
  compact?: boolean;
  hideButtons?: boolean;
  isFleetPage?: boolean;
}) {
  const vehicles = (await getVehiclesByType(type)) ?? [];

  return (
    <FleetPreviewRotating
      title={title}
      viewAllLink={viewAllLink}
      vehicles={vehicles}
      amenityMode={amenityMode}
      compact={compact}
      hideButtons={hideButtons}
      isFleetPage={isFleetPage}
    />
  );
}
