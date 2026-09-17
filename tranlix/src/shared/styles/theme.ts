/**
 * Main theme - composes palette, typography, shape, and component overrides.
 * No specific values live here - everything is imported from sub-modules.
 */

import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

export const theme = createTheme({
  palette,
  typography,
  shape: { borderRadius: 8 },
  components,
});