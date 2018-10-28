//@flow
import type ImageAnimation from '../ImageAnimation'

export interface AnimationLibrary {
  start(): void;
  finish(): void;
  pause(): void;
}
