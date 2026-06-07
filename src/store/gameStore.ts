// 全局游戏状态 - zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Anomaly, WorkType } from '../data/anomalies';
import { anomaliesById } from '../data/anomalies';
import { generateEmployee, growAttribute } from '../logic/employeeLogic';
import { performWork, workTypeAttrKey } from '../logic/anomalyLogic';
import { pickRandomOrdeal, tierOrder } from '../logic/ordealLogic';
import type { Ordeal, OrdealTier } from '../data/ordeals';
import { departments } from '../data/departments';
import { egoEquipment } from '../data/ego';

export type EmployeeStatus = 'NORMAL' | 'PANIC' | 'DEAD' | 'CORPSE';

export interface Employee {
  id: string;
  name: string;
  color: string;
  fortitude: number;  // 勇气（HP）
  prudence: number;   // 谨慎（精神）
  temperance: number; // 自律（工作成功率）
  justice: number;    // 正义（移动/攻击）
  status: EmployeeStatus;
  equippedWeapon: string | null;
  equippedArmor: string | null;
}

export interface ContainmentUnit {
  id: string;
  anomalyId: string | null;
  workCount: number;
  isMeltdown: boolean;
  meltdownTimer: number;
  meltdownSequence: number;
  baseCounter: number;
  hasBroken: boolean;
}

export interface DepartmentState {
  id: string;
  unlocked: boolean;
  units: ContainmentUnit[];
  employees: string[];
  clerkCount: number;
}

export interface GameEvent {
  id: string;
  time: number;
  day: number;
  tier?: OrdealTier | null;
  type: string;
  text: string;
  severity: 'info' | 'warn' | 'danger' | 'success';
}

export interface GameState {
  day: number;
  maxDay: number;
  isGameOver: boolean;
  isVictory: boolean;
  gameOverReason: string;

  peBox: number;
  peBoxTarget: number;
  totalCollected: number;
  research: number;

  facilityHealth: number;
  totalDeaths: number;

  timeOfDay: OrdealTier;
  dayTime: number;
  cycleTick: number;

  departments: DepartmentState[];
  employees: Record<string, Employee>;

  unlockedAnomalies: string[];
  researchedAnomalies: string[];
  researchProgress: Record<string, number>;

  currentOrdeal: Ordeal | null;
  ordealResolved: boolean;

  events: GameEvent[];

  ownedEGO: string[];
  currentStoryDept: string | null;
  storyProgress: Record<string, number>;

  selectedUnitId: string | null;
  selectedEmployeeId: string | null;
  showHelp: boolean;
}

export interface GameActions {
  tick: (dt: number) => void;
  nextDay: () => void;

  unlockAnomaly: (id: string) => void;
  startWork: (unitId: string, workType: WorkType, employeeId: string) => void;
  doMeltdownWork: (unitId: string, employeeId: string) => void;
  receiveAnomaly: (unitId: string, anomalyId: string) => void;

  hireEmployee: (deptId: string) => void;
  assignEmployee: (deptId: string, slot: number, employeeId: string) => void;
  removeEmployeeFromDept: (deptId: string, slot: number) => void;

  resolveOrdeal: (suppress: boolean) => void;

  craftEGO: (anomalyId: string, slot: 'WEAPON' | 'ARMOR') => void;
  equipEGO: (employeeId: string, egoId: string) => void;
  unequipEGO: (employeeId: string, slot: 'WEAPON' | 'ARMOR') => void;

  triggerStory: (deptId: string) => void;
  closeStory: () => void;

  selectUnit: (id: string | null) => void;
  selectEmployee: (id: string | null) => void;
  toggleHelp: () => void;

  pushEvent: (e: Omit<GameEvent, 'id' | 'time' | 'day'>) => void;
  resetGame: () => void;
}

const initState = (): GameState => {
  const initDepts: DepartmentState[] = departments.map((d, i) => ({
    id: d.id,
    unlocked: i === 0,
    units: Array.from({ length: 4 }, (_, j) => ({
      id: `${d.id}-u${j}`,
      anomalyId: null,
      workCount: 0,
      isMeltdown: false,
      meltdownTimer: 0,
      meltdownSequence: 0,
      baseCounter: 0,
      hasBroken: false,
    })),
    employees: ['', '', '', '', ''],
    clerkCount: i === 0 ? 5 : 0,
  }));

  // 5 名初始员工（控制部）
  const initEmps: Record<string, Employee> = {};
  for (let i = 0; i < 5; i++) {
    const e = generateEmployee();
    initEmps[e.id] = e;
    initDepts[0].employees[i] = e.id;
  }

  return {
    day: 1,
    maxDay: 50,
    isGameOver: false,
    isVictory: false,
    gameOverReason: '',

    peBox: 0,
    peBoxTarget: 30,
    totalCollected: 0,
    research: 0,

    facilityHealth: 100,
    totalDeaths: 0,

    timeOfDay: 'DAWN',
    dayTime: 0,
    cycleTick: 0,

    departments: initDepts,
    employees: initEmps,

    unlockedAnomalies: ['F-01-01'],
    researchedAnomalies: [],
    researchProgress: { 'F-01-01': 1 },

    currentOrdeal: null,
    ordealResolved: false,

    events: [
      {
        id: 'evt-init',
        time: 0,
        day: 1,
        tier: null,
        type: 'DAILY',
        text: '主管系统启动。控制部初始化完成。',
        severity: 'info',
      },
      {
        id: 'evt-anom',
        time: 0,
        day: 1,
        tier: null,
        type: 'DAILY',
        text: '异想体 F-01-01 「可爱的鸟」已接收。',
        severity: 'info',
      },
    ],

    ownedEGO: [],
    currentStoryDept: null,
    storyProgress: {},

    selectedUnitId: `${initDepts[0].units[0].id}`,
    selectedEmployeeId: initDepts[0].employees[0] || null,
    showHelp: false,
  };
};

const outcomeLabel = (o: string) => {
  const map: Record<string, string> = {
    PE_BOX: '产出能源',
    BLACK: '吞噬能源',
    WHITE_DAMAGE: '精神损伤',
    RED_DAMAGE: '物理损伤',
    BREAK: '突破收容',
  };
  return map[o] || o;
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...initState(),

      tick: (dt) => {
        const s = get();
        if (s.isGameOver) return;

        const newTick = s.cycleTick + 1;
        let { dayTime, timeOfDay, departments: depts, employees: emps, currentOrdeal, ordealResolved } = s;
        dayTime += dt;

        // 异想体熔毁倒计时
        const meltedUnits: { unitId: string; anomalyId: string }[] = [];
        const brokenUnits: { unitId: string; anomalyId: string }[] = [];
        const newDepts = depts.map(d => ({
          ...d,
          units: d.units.map(u => {
            if (!u.isMeltdown) return u;
            const t = Math.max(0, u.meltdownTimer - dt);
            if (t === 0) {
              brokenUnits.push({ unitId: u.id, anomalyId: u.anomalyId || '' });
              return { ...u, isMeltdown: false, meltdownTimer: 0, hasBroken: true };
            }
            return { ...u, meltdownTimer: t };
          }),
        }));

        // 异想体工作计数累积（每 6 秒自然 +1，简化：每 tick 概率增加）
        // 检查是否到了熔毁阈值
        const updatedDepts = newDepts.map(d => ({
          ...d,
          units: d.units.map(u => {
            if (!u.anomalyId || u.isMeltdown || u.hasBroken) return u;
            const a = anomaliesById(u.anomalyId);
            if (!a) return u;
            if (u.workCount >= a.counterThreshold + u.baseCounter && !u.isMeltdown) {
              meltedUnits.push({ unitId: u.id, anomalyId: u.anomalyId });
              return { ...u, isMeltdown: true, meltdownTimer: 60, meltdownSequence: u.meltdownSequence + 1 };
            }
            return u;
          }),
        }));

        // 自然工作计数累积：每 6 秒 +1
        const tickedDepts = updatedDepts.map(d => ({
          ...d,
          units: d.units.map(u => {
            if (!u.anomalyId || u.isMeltdown || u.hasBroken) return u;
            // 每 6 秒增长
            if (Math.floor((s.cycleTick + 1) / 6) > Math.floor(s.cycleTick / 6)) {
              return { ...u, workCount: u.workCount + 1 };
            }
            return u;
          }),
        }));

        // 推送熔毁 / 突破事件
        for (const m of meltedUnits) {
          const a = anomaliesById(m.anomalyId);
          if (a) {
            get().pushEvent({
              type: 'MELTDOWN',
              text: `${a.name} 触发逆卡巴拉熔毁！60秒内必须工作。`,
              severity: 'danger',
            });
          }
        }
        for (const b of brokenUnits) {
          const a = anomaliesById(b.anomalyId);
          if (a) {
            get().pushEvent({
              type: 'BREAK',
              text: `${a.name} 突破收容！`,
              severity: 'danger',
            });
          }
        }

        // 时段推进
        const segLen = 15;
        while (dayTime >= segLen) {
          dayTime -= segLen;
          const idx = tierOrder.indexOf(timeOfDay);
          if (idx < tierOrder.length - 1) {
            timeOfDay = tierOrder[idx + 1];
            const o = pickRandomOrdeal(timeOfDay, Math.floor(newTick / 7) + idx);
            currentOrdeal = o;
            ordealResolved = false;
            get().pushEvent({
              type: 'ORDEAL',
              tier: timeOfDay,
              text: `${o.name} 触发。${o.description}`,
              severity: 'warn',
            });
          } else {
            // 进入下一天
            set({
              departments: tickedDepts,
              employees: emps,
              cycleTick: newTick,
            });
            get().nextDay();
            return;
          }
        }

        set({
          cycleTick: newTick,
          dayTime,
          timeOfDay,
          currentOrdeal,
          ordealResolved,
          departments: tickedDepts,
        });
      },

      nextDay: () => {
        const s = get();
        if (s.day >= s.maxDay) {
          set({ isVictory: true, isGameOver: true, gameOverReason: '50 天能源收集完成。' });
          return;
        }
        const newDay = s.day + 1;
        const newDepts = s.departments.map(d => ({ ...d, units: d.units.map(u => ({ ...u })) }));
        const newEmps: Record<string, Employee> = { ...s.employees };
        const toUnlock = newDepts.find(d => !d.unlocked);
        if (toUnlock) {
          toUnlock.unlocked = true;
          for (let i = 0; i < 5; i++) {
            const e = generateEmployee();
            newEmps[e.id] = e;
            toUnlock.employees[i] = e.id;
          }
        }
        // 接收新异想体（每天一个）
        // 简化：每 5 天接收一个，ALEPH 必须收容过 WAW 后才解锁
        const cycleUnlocks = ['F-01-01', 'O-01-04', 'F-02-49', 'O-02-62', 'F-03-22', 'F-04-83', 'O-04-13', 'F-05-29', 'O-05-07', 'F-06-32', 'O-06-17'];
        if (newDay % 3 === 0) {
          const idx = Math.min(Math.floor(newDay / 3), cycleUnlocks.length - 1);
          const aid = cycleUnlocks[idx];
          if (!s.unlockedAnomalies.includes(aid)) {
            // 找到一个空单元
            const targetUnit = newDepts[0].units.find(u => !u.anomalyId && !u.hasBroken);
            if (targetUnit) {
              targetUnit.anomalyId = aid;
              const a = anomaliesById(aid);
              if (a) {
                get().pushEvent({
                  type: 'DAILY',
                  text: `新异想体入库：${a.name} [${a.riskClass}]`,
                  severity: 'warn',
                });
              }
            }
            set({ unlockedAnomalies: [...s.unlockedAnomalies, aid] });
          }
        }
        // 清理已突破异想体（死亡员工清理）
        // 简化：每 10 天如果崩溃则结束
        if (s.facilityHealth <= 0) {
          set({ isGameOver: true, gameOverReason: '设施严重损毁。' });
          return;
        }

        set({
          day: newDay,
          departments: newDepts,
          employees: newEmps,
          timeOfDay: 'DAWN',
          dayTime: 0,
          peBox: 0,
          peBoxTarget: 30 + newDay * 3,
          ordealResolved: false,
          currentOrdeal: pickRandomOrdeal('DAWN', newDay * 31),
        });
        get().pushEvent({
          type: 'DAILY',
          text: `第 ${newDay} 天。当日目标 ${30 + newDay * 3} PE-BOX。`,
          severity: 'info',
        });
        if (toUnlock) {
          get().pushEvent({
            type: 'DAILY',
            text: `${toUnlock.id.toUpperCase()} 部门已解锁。`,
            severity: 'success',
          });
        }
      },

      unlockAnomaly: (id) => {
        const s = get();
        if (s.unlockedAnomalies.includes(id)) return;
        set({ unlockedAnomalies: [...s.unlockedAnomalies, id] });
        const a = anomaliesById(id);
        if (a) {
          get().pushEvent({
            type: 'DAILY',
            text: `异想体信息解锁：${a.name} [${a.riskClass}]`,
            severity: 'info',
          });
        }
      },

      receiveAnomaly: (unitId, anomalyId) => {
        const s = get();
        const newDepts = s.departments.map(d => ({
          ...d,
          units: d.units.map(u => {
            if (u.id !== unitId) return u;
            return { ...u, anomalyId, workCount: 0, isMeltdown: false, meltdownTimer: 0, hasBroken: false };
          }),
        }));
        set({ departments: newDepts });
        const a = anomaliesById(anomalyId);
        if (a) {
          get().pushEvent({
            type: 'DAILY',
            text: `${a.name} 已收容至单元 ${unitId.split('-').pop()}。`,
            severity: 'info',
          });
        }
      },

      startWork: (unitId, workType, employeeId) => {
        const s = get();
        const dept = s.departments.find(d => d.units.some(u => u.id === unitId));
        if (!dept) return;
        const unit = dept.units.find(u => u.id === unitId);
        if (!unit || !unit.anomalyId || unit.isMeltdown || unit.hasBroken) return;
        const anomaly = anomaliesById(unit.anomalyId);
        const emp = s.employees[employeeId];
        if (!anomaly || !emp || emp.status !== 'NORMAL') return;

        const attr = workTypeAttrKey(workType);
        const { outcome, energyDelta, damage } = performWork(anomaly, workType, {
          fortitude: emp.fortitude,
          prudence: emp.prudence,
          temperance: emp.temperance,
          justice: emp.justice,
        });

        const newEmps = { ...s.employees };
        const newEmp: Employee = { ...emp };
        if (outcome === 'WHITE_DAMAGE' || outcome === 'BREAK') {
          newEmp.prudence = Math.max(0, emp.prudence - damage);
          if (newEmp.prudence <= 0) {
            newEmp.status = 'PANIC';
            get().pushEvent({
              type: 'PANIC',
              text: `${emp.name} 精神崩溃，陷入恐慌！`,
              severity: 'danger',
            });
          }
        } else if (outcome === 'RED_DAMAGE') {
          newEmp.fortitude = Math.max(0, emp.fortitude - damage);
          if (newEmp.fortitude <= 0) {
            newEmp.status = 'DEAD';
            get().pushEvent({
              type: 'DEATH',
              text: `${emp.name} 在工作中死亡。`,
              severity: 'danger',
            });
          }
        } else {
          (newEmp as any)[attr] = growAttribute(emp, attr);
        }
        newEmps[employeeId] = newEmp;

        const newDepts = s.departments.map(d => {
          if (d.id !== dept.id) return d;
          return {
            ...d,
            units: d.units.map(u => {
              if (u.id !== unitId) return u;
              if (outcome === 'BREAK') {
                return { ...u, hasBroken: true, isMeltdown: false, meltdownTimer: 0, workCount: u.workCount + 1 };
              }
              return { ...u, workCount: u.workCount + 1 };
            }),
          };
        });

        const newPE = Math.max(0, s.peBox + energyDelta);
        const newTotal = s.totalCollected + Math.max(0, energyDelta);
        const newResearch = s.research + anomaly.baseResearchYield;

        // 研究进度
        const newResearchProgress = { ...s.researchProgress };
        const cur = newResearchProgress[anomaly.id] || 0;
        newResearchProgress[anomaly.id] = Math.min(1, cur + 0.05);
        const newResearched = [...s.researchedAnomalies];
        if (newResearchProgress[anomaly.id] >= 1 && !newResearched.includes(anomaly.id)) {
          newResearched.push(anomaly.id);
        }

        set({
          employees: newEmps,
          departments: newDepts,
          peBox: newPE,
          totalCollected: newTotal,
          research: newResearch,
          researchProgress: newResearchProgress,
          researchedAnomalies: newResearched,
        });

        get().pushEvent({
          type: 'WORK_RESULT',
          text: `${emp.name} → ${anomaly.name} [${workType}] · ${outcomeLabel(outcome)}${energyDelta !== 0 ? `（${energyDelta > 0 ? '+' : ''}${energyDelta} PE）` : ''}`,
          severity: outcome === 'PE_BOX' ? 'success' : outcome === 'BREAK' || outcome === 'RED_DAMAGE' ? 'danger' : 'warn',
        });
      },

      doMeltdownWork: (unitId, employeeId) => {
        const s = get();
        const dept = s.departments.find(d => d.units.some(u => u.id === unitId));
        if (!dept) return;
        const unit = dept.units.find(u => u.id === unitId);
        if (!unit || !unit.isMeltdown || !unit.anomalyId) return;
        const anomaly = anomaliesById(unit.anomalyId);
        const emp = s.employees[employeeId];
        if (!anomaly || !emp || emp.status !== 'NORMAL') return;

        const success = Math.random() > 0.35;
        const newDepts = s.departments.map(d => {
          if (d.id !== dept.id) return d;
          return {
            ...d,
            units: d.units.map(u => {
              if (u.id !== unitId) return u;
              if (success) {
                return { ...u, isMeltdown: false, meltdownTimer: 0, workCount: 0, baseCounter: u.baseCounter + 1 };
              } else {
                return { ...u, hasBroken: true, isMeltdown: false, meltdownTimer: 0 };
              }
            }),
          };
        });

        const newEmps = { ...s.employees };
        const dmg = success ? 5 : 20;
        const newEmp: Employee = { ...emp, fortitude: Math.max(0, emp.fortitude - dmg) };
        if (newEmp.fortitude <= 0) {
          newEmp.status = 'DEAD';
          get().pushEvent({
            type: 'DEATH',
            text: `${emp.name} 在熔毁镇压中死亡。`,
            severity: 'danger',
          });
        }
        newEmps[employeeId] = newEmp;

        set({ employees: newEmps, departments: newDepts });

        get().pushEvent({
          type: success ? 'WORK' : 'BREAK',
          text: success
            ? `${emp.name} 成功抑制 ${anomaly.name} 的熔毁！`
            : `${anomaly.name} 突破收容！${emp.name} 重伤。`,
          severity: success ? 'success' : 'danger',
        });
      },

      hireEmployee: (deptId) => {
        const e = generateEmployee();
        const s = get();
        const dept = s.departments.find(d => d.id === deptId);
        if (!dept) return;
        const newDepts = s.departments.map(d => {
          if (d.id !== deptId) return d;
          const newEmps = [...d.employees];
          const slot = newEmps.findIndex(s => !s);
          if (slot >= 0) newEmps[slot] = e.id;
          return { ...d, employees: newEmps };
        });
        set({ employees: { ...s.employees, [e.id]: e }, departments: newDepts });
        get().pushEvent({
          type: 'DAILY',
          text: `新员工 ${e.name} 分配至 ${deptId.toUpperCase()}。`,
          severity: 'info',
        });
      },

      assignEmployee: (deptId, slot, employeeId) => {
        const s = get();
        const newDepts = s.departments.map(d => {
          if (d.id !== deptId) return d;
          const newEmps = [...d.employees];
          newEmps[slot] = employeeId;
          return { ...d, employees: newEmps };
        });
        set({ departments: newDepts });
      },

      removeEmployeeFromDept: (deptId, slot) => {
        const s = get();
        const newDepts = s.departments.map(d => {
          if (d.id !== deptId) return d;
          const newEmps = [...d.employees];
          newEmps[slot] = '';
          return { ...d, employees: newEmps };
        });
        set({ departments: newDepts });
      },

      resolveOrdeal: (suppress) => {
        const s = get();
        if (!s.currentOrdeal || s.ordealResolved) return;
        if (suppress) {
          const reward = Math.floor(s.peBoxTarget * s.currentOrdeal.rewardPercent / 100);
          const newHealth = Math.max(0, s.facilityHealth - 3);
          set({
            peBox: s.peBox + reward,
            ordealResolved: true,
            facilityHealth: newHealth,
            isGameOver: newHealth <= 0 ? true : s.isGameOver,
            gameOverReason: newHealth <= 0 ? '设施完全损坏。' : s.gameOverReason,
          });
          get().pushEvent({
            type: 'ORDEAL',
            text: `${s.currentOrdeal.name} 镇压成功！能源 +${reward}`,
            severity: 'success',
          });
        } else {
          const o = s.currentOrdeal;
          if (o.color === 'RED') {
            const newHealth = Math.max(0, s.facilityHealth - 25);
            set({
              ordealResolved: true,
              facilityHealth: newHealth,
              isGameOver: newHealth <= 0 ? true : s.isGameOver,
              gameOverReason: newHealth <= 0 ? '红色考验未镇压，设施损毁。' : s.gameOverReason,
            });
            get().pushEvent({
              type: 'ORDEAL',
              text: `${o.name} 失控，设施受损 -25%`,
              severity: 'danger',
            });
          } else {
            set({ ordealResolved: true, research: Math.max(0, s.research - 2) });
            get().pushEvent({
              type: 'ORDEAL',
              text: `${o.name} 失败，研究点数 -2`,
              severity: 'warn',
            });
          }
        }
      },

      craftEGO: (anomalyId, slot) => {
        const s = get();
        const e = egoEquipment.find(x => x.anomalyId === anomalyId && x.slot === slot);
        if (!e) return;
        if (!s.researchedAnomalies.includes(anomalyId)) {
          get().pushEvent({
            type: 'CRAFT',
            text: '异想体研究未完成，无法锻造 E.G.O。',
            severity: 'warn',
          });
          return;
        }
        if (s.ownedEGO.includes(e.id)) {
          get().pushEvent({ type: 'CRAFT', text: '已拥有该 E.G.O。', severity: 'info' });
          return;
        }
        if (s.research < e.researchCost) {
          get().pushEvent({ type: 'CRAFT', text: `研究点数不足（需 ${e.researchCost}）。`, severity: 'warn' });
          return;
        }
        set({ ownedEGO: [...s.ownedEGO, e.id], research: s.research - e.researchCost });
        get().pushEvent({ type: 'CRAFT', text: `已锻造 E.G.O：${e.name}`, severity: 'success' });
      },

      equipEGO: (employeeId, egoId) => {
        const s = get();
        const e = egoEquipment.find(x => x.id === egoId);
        if (!e) return;
        const emp = s.employees[employeeId];
        if (!emp) return;
        // 先卸下同类
        if (e.slot === 'WEAPON' && emp.equippedWeapon) {
          get().unequipEGO(employeeId, 'WEAPON');
        }
        if (e.slot === 'ARMOR' && emp.equippedArmor) {
          get().unequipEGO(employeeId, 'ARMOR');
        }
        const cur = get().employees[employeeId];
        const newEmp: Employee = {
          ...cur,
          equippedWeapon: e.slot === 'WEAPON' ? egoId : cur.equippedWeapon,
          equippedArmor: e.slot === 'ARMOR' ? egoId : cur.equippedArmor,
          fortitude: cur.fortitude + e.fortitudeBonus,
          prudence: cur.prudence + e.prudenceBonus,
          temperance: cur.temperance + e.temperanceBonus,
          justice: cur.justice + e.justiceBonus,
        };
        set({ employees: { ...get().employees, [employeeId]: newEmp } });
        get().pushEvent({ type: 'CRAFT', text: `${emp.name} 装备了 ${e.name}`, severity: 'info' });
      },

      unequipEGO: (employeeId, slot) => {
        const s = get();
        const emp = s.employees[employeeId];
        if (!emp) return;
        const egoId = slot === 'WEAPON' ? emp.equippedWeapon : emp.equippedArmor;
        if (!egoId) return;
        const e = egoEquipment.find(x => x.id === egoId);
        const newEmp: Employee = {
          ...emp,
          equippedWeapon: slot === 'WEAPON' ? null : emp.equippedWeapon,
          equippedArmor: slot === 'ARMOR' ? null : emp.equippedArmor,
        };
        if (e) {
          newEmp.fortitude -= e.fortitudeBonus;
          newEmp.prudence -= e.prudenceBonus;
          newEmp.temperance -= e.temperanceBonus;
          newEmp.justice -= e.justiceBonus;
        }
        set({ employees: { ...s.employees, [employeeId]: newEmp } });
      },

      triggerStory: (deptId) => {
        set({ currentStoryDept: deptId });
      },

      closeStory: () => {
        const s = get();
        if (s.currentStoryDept) {
          set({
            currentStoryDept: null,
            storyProgress: { ...s.storyProgress, [s.currentStoryDept]: (s.storyProgress[s.currentStoryDept] || 0) + 1 },
          });
        }
      },

      selectUnit: (id) => set({ selectedUnitId: id }),
      selectEmployee: (id) => set({ selectedEmployeeId: id }),
      toggleHelp: () => set(s => ({ showHelp: !s.showHelp })),

      pushEvent: (e) => {
        const s = get();
        const evt: GameEvent = {
          ...e,
          id: 'evt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          time: s.dayTime,
          day: s.day,
        };
        set({ events: [evt, ...s.events].slice(0, 100) });
      },

      resetGame: () => {
        set(initState());
      },
    }),
    {
      name: 'lobotomy-corp-save',
      partialize: (state) => ({
        day: state.day,
        peBox: state.peBox,
        peBoxTarget: state.peBoxTarget,
        totalCollected: state.totalCollected,
        research: state.research,
        facilityHealth: state.facilityHealth,
        totalDeaths: state.totalDeaths,
        departments: state.departments,
        employees: state.employees,
        unlockedAnomalies: state.unlockedAnomalies,
        researchedAnomalies: state.researchedAnomalies,
        researchProgress: state.researchProgress,
        ownedEGO: state.ownedEGO,
        storyProgress: state.storyProgress,
      }),
    }
  )
);
