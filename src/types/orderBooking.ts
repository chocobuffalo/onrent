/**
 * {
    "order_id": 117,
    "session_id": "b7fb2884-1d2b-4586-94f6-50c3edf5bde4",
    "state": "draft",
    "message": "Pre-orden creada con múltiples productos."
}

{
  "order_id": 0,
  "name": "string",
  "state": "string",
  "project": "string",
  "machine_name": "string",
  "operator_name": "string",
  "provider_name": "string",
  "start_date": "string",
  "end_date": "string",
  "duration_days": 0,
  "location_coords": {
    "additionalProp1": 0,
    "additionalProp2": 0,
    "additionalProp3": 0
  },
  "work_description": "string",
  "items": [],
  "rental_total": 0,
  "fleet_cost": 0,
  "insurance_cost": 0,
  "taxes": 0,
  "total_final": 0
}
 */

export interface OrderBookingInterface {
    order_id: number | null;
    session_id?: string | null;
}