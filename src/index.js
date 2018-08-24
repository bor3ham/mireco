import * as forms from './forms'
import * as blockForms from './forms/block'
export default {
  ...forms,
  block: {
    ...blockForms,
  },
}
