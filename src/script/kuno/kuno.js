import { version } from '../package.json';
import clone from './core/clone';
import defaultValue from './core/defaultValue';
import defined from './core/defined';
import freezeObject from './core/freezeObject';

const kuno = {
  VERSION: version,
  clone,
  defaultValue,
  defined,
  freezeObject,
};

export default kuno;
