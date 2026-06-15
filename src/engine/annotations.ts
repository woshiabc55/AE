import type { Annotation, FacialControl } from "@/types";
import { uid } from "@/utils/id";

export function createBoneAnnotation(
  partial: Partial<Annotation> & { x: number; y: number; t: number; label: string }
): Annotation {
  return {
    id: uid("bone"),
    kind: "bone",
    color: "#7CFFB2",
    ...partial,
  } as Annotation;
}

export function createFacialAnnotation(
  control: FacialControl,
  x: number,
  y: number,
  t: number
): Annotation {
  return {
    id: uid("facial"),
    kind: "facial",
    control,
    x,
    y,
    t,
  };
}

export function activeAnnotations(
  list: Annotation[],
  t: number,
  window = 1.2
): Annotation[] {
  return list.filter((a) => Math.abs(a.t - t) <= window);
}
