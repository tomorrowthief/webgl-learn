/** 案例难度等级 */
export type CaseLevel = 'beginner' | 'advanced' | 'webgl';

/** 首页分类（和 CaseLevel 略有不同） */
export type Category = 'all' | 'beginner' | 'advanced' | 'webgl';

/** 沙箱类型 */
export type SandboxType = 'three' | 'webgl';

/** 知识模块 */
export type CaseModule = 'basics' | 'materials' | 'interaction' | 'effects' | 'webgl';

/** 模块显示名称 */
export const MODULE_LABELS: Record<CaseModule, string> = {
  basics: 'Three.js 基础',
  materials: '材质与光照',
  interaction: '交互与动画',
  effects: '高级特效',
  webgl: 'WebGL 原生',
};

/** 案例元数据 */
export interface CaseMeta {
  id: string;
  title: string;
  description: string;
  level: CaseLevel;
  module: CaseModule;
  thumbnail: string;
  templateFile: string;
  sandboxType?: SandboxType;
  tags: string[];
}

/** 案例完整数据 */
export interface CaseData extends CaseMeta {
  templateCode: string;
}

/** 沙箱错误信息 */
export interface SandboxError {
  type: string;
  message: string;
  line?: number;
  stack?: string;
}

/** 沙箱消息类型 */
export interface SandboxResultMessage {
  type: 'result';
  success: boolean;
  error?: SandboxError;
}

export interface SandboxReadyMessage {
  type: 'ready';
}

export type SandboxMessage = SandboxResultMessage | SandboxReadyMessage;

/** 运行请求消息 */
export interface RunRequestMessage {
  type: 'run';
  code: string;
}

export type MainToSandboxMessage = RunRequestMessage;