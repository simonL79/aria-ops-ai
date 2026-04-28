// Shared Shield action constants. Single source of truth for action names
// and the function->action mapping. Imported by both shield-mint-token and
// the consume helper to prevent drift.

export const SHIELD_ACTIONS = {
  promote: 'promote',
  transition: 'transition',
  capture: 'capture',
} as const;

export type ShieldAction = typeof SHIELD_ACTIONS[keyof typeof SHIELD_ACTIONS];

export const SHIELD_FUNCTION_ACTIONS = {
  'shield-promote-threat': SHIELD_ACTIONS.promote,
  'shield-transition-alert': SHIELD_ACTIONS.transition,
  'shield-capture-url-metadata': SHIELD_ACTIONS.capture,
} as const;

export type ShieldFunctionName = keyof typeof SHIELD_FUNCTION_ACTIONS;

export const ALLOWED_SHIELD_ACTIONS: ShieldAction[] = Object.values(SHIELD_ACTIONS);

export function isShieldAction(value: unknown): value is ShieldAction {
  return typeof value === 'string' && (ALLOWED_SHIELD_ACTIONS as string[]).includes(value);
}
