import {fileURLToPath} from 'node:url';
import test from 'ava';
import {execaNode} from 'execa';
import chalk from '../source/index.js';

chalk.level = 1;

test('don\'t output colors when manually disabled', t => {
	const oldLevel = chalk.level;
	chalk.level = 0;
	t.is(chalk.red('foo'), 'foo');
	chalk.level = oldLevel;
});

test('enable/disable colors based on overall chalk .level property, not individual instances', t => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	t.is(red.level, 1);
	chalk.level = 0;
	t.is(red.level, chalk.level);
	chalk.level = oldLevel;
});

test('propagate enable/disable changes from child colors', t => {
	const oldLevel = chalk.level;
	chalk.level = 1;
	const {red} = chalk;
	t.is(red.level, 1);
	t.is(chalk.level, 1);
	red.level = 0;
	t.is(red.level, 0);
	t.is(chalk.level, 0);
	chalk.level = 1;
	t.is(red.level, 1);
	t.is(chalk.level, 1);
	chalk.level = oldLevel;
});

test('disable colors if they are not supported', async t => {
	const {stdout} = await execaNode(fileURLToPath(new URL('_fixture.js', import.meta.url)));
	t.is(stdout, 'testout testerr');
});

test('FORCE_COLOR=0 disables color support', async t => {
	const {stdout} = await execaNode(
		fileURLToPath(new URL('_force-color-fixture.js', import.meta.url)),
		{env: {FORCE_COLOR: '0'}},
	);
	t.is(stdout, 'false');
});

test('FORCE_COLOR=1 sets level 1', async t => {
	const {stdout} = await execaNode(
		fileURLToPath(new URL('_force-color-fixture.js', import.meta.url)),
		{env: {FORCE_COLOR: '1'}},
	);
	const result = JSON.parse(stdout);
	t.is(result.level, 1);
	t.true(result.hasBasic);
	t.false(result.has256);
	t.false(result.has16m);
});

test('FORCE_COLOR=2 sets level 2', async t => {
	const {stdout} = await execaNode(
		fileURLToPath(new URL('_force-color-fixture.js', import.meta.url)),
		{env: {FORCE_COLOR: '2'}},
	);
	const result = JSON.parse(stdout);
	t.is(result.level, 2);
	t.true(result.hasBasic);
	t.true(result.has256);
	t.false(result.has16m);
});

test('FORCE_COLOR=3 sets level 3', async t => {
	const {stdout} = await execaNode(
		fileURLToPath(new URL('_force-color-fixture.js', import.meta.url)),
		{env: {FORCE_COLOR: '3'}},
	);
	const result = JSON.parse(stdout);
	t.is(result.level, 3);
	t.true(result.hasBasic);
	t.true(result.has256);
	t.true(result.has16m);
});
