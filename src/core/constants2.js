/** Defines the cross module used constants to avoid circular dependncies */
/** 定义跨模块使用的常量以避免循环依赖 */

import { Constants as alpha_blending } from './constantModule/alpha_blending.js'
import { Constants as delay_load_state } from './constantModule/delay_load_state.js'
import { Constants as depht_or_stencil_test } from './constantModule/depht_or_stencil_test.js'
import { Constants as other } from './constantModule/other.js'
import { Constants as texture_filter } from './constantModule/texture_filter.js'
import { Constants as texture_format } from './constantModule/texture_format.js'
import { Constants as texture_repeating } from './constantModule/texture_repeating.js'
import { Constants as texture_type } from './constantModule/texture_type.js'

class Constants { }
Constants = Object.assign(
  alpha_blending,
  delay_load_state,
  depht_or_stencil_test,
  other,
  texture_filter,
  texture_format,
  texture_repeating,
  texture_type
);
export {Constants}
