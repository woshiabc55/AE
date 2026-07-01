// P0 地基运行时自检 —— 验证"控制结构化复杂"承诺的兑现点
// 跑：npx tsx src/game/__check__/selfcheck.ts
import assert from 'node:assert';
import { bootstrapWorld } from '../content/bootstrap';
import { RULES } from '../content/rules';
import { RuleEngine } from '../engine/RuleEngine';
import { StateManager } from '../engine/StateManager';
import { CommandBus } from '../engine/CommandBus';
import { EventBus } from '../engine/EventBus';
import { projectGame } from '../projection/projection';

const boot = bootstrapWorld();
const bus = new EventBus();
const rules = new RuleEngine();
for (const r of RULES) rules.register(r);
const state = new StateManager(boot.world);
const cmds = new CommandBus(rules, state, bus);
const pid = boot.playerFactionId;
const aid = boot.aiFactionId;

// 1. 初始投影
let view = projectGame(state.world, pid);
assert.strictEqual(view.hand.length, 3, '初始手牌应为3');
const player0 = view.factions.find((f) => f.isPlayer)!;
assert.strictEqual(player0.gold, 30, '初始金币30');
assert.strictEqual(player0.food, 25, '初始粮草25');
assert.strictEqual(player0.troops, 12, '初始兵力12');

// 2. 出 militia（cost food3 → food22, troops+5 → 17）
const militia = view.hand.find((c) => c.templateId === 'militia')!;
assert.ok(militia?.playable, '民兵应可出');
const r1 = cmds.dispatch({ type: 'PLAY_CARD', payload: { cardInstanceId: militia.instanceId }, source: 'player' });
assert.ok(r1.ok, '出民兵应成功');
view = projectGame(state.world, pid);
const p1 = view.factions.find((f) => f.isPlayer)!;
assert.strictEqual(p1.troops, 17, 'troops +5 = 17');
assert.strictEqual(p1.food, 22, 'food -3 = 22');
assert.strictEqual(view.hand.length, 2, '手牌-1');

// 3. 重放一致性自检（P0 核心承诺）
assert.ok(state.verifyReplay(), '重放应与当前状态一致');

// 4. undo 回滚
state.undo();
view = projectGame(state.world, pid);
const p2 = view.factions.find((f) => f.isPlayer)!;
assert.strictEqual(p2.troops, 12, 'undo troops 恢复12');
assert.strictEqual(p2.food, 25, 'undo food 恢复25');
assert.strictEqual(view.hand.length, 3, 'undo 手牌恢复3');

// 5. raid 劫掠 ai（cost food4 → food21; ai troops-6 → 6; player gold+12 → 42）
const raid = view.hand.find((c) => c.templateId === 'raid')!;
const r2 = cmds.dispatch({
  type: 'PLAY_CARD',
  payload: { cardInstanceId: raid.instanceId, targetFactionId: aid },
  source: 'player',
});
assert.ok(r2.ok, '出 raid 应成功');
view = projectGame(state.world, pid);
const ai = view.factions.find((f) => !f.isPlayer)!;
assert.strictEqual(ai.troops, 6, 'ai troops -6 = 6');
const p3 = view.factions.find((f) => f.isPlayer)!;
assert.strictEqual(p3.gold, 42, 'player gold +12 = 42');
assert.strictEqual(p3.food, 21, 'player food -4 = 21');

// 6. 时代门禁：stone 时代打 bronze 卡 shrine 应被拒（硬规则）
state.applyEffects([
  { kind: 'CREATE_CARD', card: 'test_shrine', templateId: 'shrine', ownerFaction: pid },
  { kind: 'ADD_CARD_TO_HAND', faction: pid, card: 'test_shrine' },
]);
const r3 = cmds.dispatch({ type: 'PLAY_CARD', payload: { cardInstanceId: 'test_shrine' }, source: 'player' });
assert.ok(!r3.ok, 'stone 时代打 bronze 卡应被拒');
assert.ok(r3.reason?.includes('时代'), `拒绝原因应含时代，实际: ${r3.reason}`);

// 7. 时代跃迁 stone → bronze（熵 +10）
const r4 = cmds.dispatch({ type: 'ADVANCE_ERA', payload: { era: 'bronze' }, source: 'player' });
assert.ok(r4.ok, '跃迁 bronze 应成功');
view = projectGame(state.world, pid);
assert.strictEqual(view.era, 'bronze', '当前时代 bronze');
assert.strictEqual(view.entropy, 10, '文明熵 +10');

// 8. 时代倒退应被拒（硬规则：不可倒退）
const r5 = cmds.dispatch({ type: 'ADVANCE_ERA', payload: { era: 'stone' }, source: 'player' });
assert.ok(!r5.ok, '时代倒退应被拒');

// 9. 跃迁后 shrine 可出
const r6 = cmds.dispatch({ type: 'PLAY_CARD', payload: { cardInstanceId: 'test_shrine' }, source: 'player' });
assert.ok(r6.ok, 'bronze 时代 shrine 应可出');

// 10. 资源不足应被拒：连续抽牌+出牌耗尽资源后校验（直接构造超 cost）
// 抽牌多次消耗——这里直接验证 gold 不足场景：shrine cost gold20，把 player gold 压低
state.applyEffects([{ kind: 'MODIFY_FIELD', entity: pid, component: 'Economic', field: 'gold', delta: -1000 }]);
state.applyEffects([
  { kind: 'CREATE_CARD', card: 'test_shrine2', templateId: 'shrine', ownerFaction: pid },
  { kind: 'ADD_CARD_TO_HAND', faction: pid, card: 'test_shrine2' },
]);
const r7 = cmds.dispatch({ type: 'PLAY_CARD', payload: { cardInstanceId: 'test_shrine2' }, source: 'player' });
assert.ok(!r7.ok, '金币不足应被拒');

// 11. 最终重放一致性（经历 undo/出牌/跃迁/门禁后仍一致）
assert.ok(state.verifyReplay(), '最终重放应一致');

console.log('✅ P0 自检全部通过');
console.log(`   事件数: ${state.timeline.length}`);
console.log(`   因果图节点: ${state.graph.size()}`);
console.log(`   当前时代: ${state.era()}, 回合: ${state.turn()}`);
