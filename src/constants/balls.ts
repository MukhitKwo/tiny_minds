// Ball count, appearance, and physics defaults.

export const BALL_COUNT = 50000;
export const BALL_TEXTURE_SIZE = 32;
export const BALL_COLOR = 0xe63946;
export const BALL_MIN_RADIUS = 2;
export const BALL_MAX_RADIUS = 10;
export const BALL_INITIAL_SPEED = 100;

// Physics update: speed below this (squared) is treated as zero.
export const BALL_SLEEP_SPEED_SQ = 0.01;

// Largest time step fed to the physics update, in seconds.
export const MAX_SIMULATION_STEP = 1 / 30;

export const PHYSICS_DEFAULT_RADIUS = 5;
export const PHYSICS_DEFAULT_MASS = 1;
export const PHYSICS_DEFAULT_BOUNCE = 0.99;
export const PHYSICS_DEFAULT_DECAY = 0;

export const GRAPHIC_DEFAULT_RADIUS = 2;
export const GRAPHIC_DEFAULT_MASS = 1;
