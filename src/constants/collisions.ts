// Collision tolerances and response settings.

// Added to the distance so the normal stays finite for overlapping centers.
export const DISTANCE_EPSILON = 1e-8;

// Share of the overlap each circle is pushed out by.
export const CONTACT_PUSH_SHARE = 0.5;

// Keeps the cell search range from rounding up across a cell boundary.
export const CELL_RANGE_EPSILON = 1e-6;
