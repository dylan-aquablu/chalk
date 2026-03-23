import test from 'ava';
import chalk, {Chalk} from '../source/index.js';

test('works with frozen Object.prototype and Function.prototype', t => {
	Object.freeze(Object.prototype);
	Object.freeze(Function.prototype);

	// Verify chalk still works at runtime when prototypes are frozen
	const instance = new Chalk({level: 1});
	t.is(instance.red('foo'), '\u001B[31mfoo\u001B[39m');
	t.is(instance.red.bold('foo'), '\u001B[31m\u001B[1mfoo\u001B[22m\u001B[39m');
	t.is(instance.rgb(255, 0, 0)('foo'), '\u001B[91mfoo\u001B[39m');
});
