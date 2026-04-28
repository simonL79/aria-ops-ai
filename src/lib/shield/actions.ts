// Mirror of supabase/functions/_shared/shieldActions.ts for client use.
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
