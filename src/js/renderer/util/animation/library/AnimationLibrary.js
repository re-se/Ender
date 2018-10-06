//@flow
import type ImageAnimation from '../ImageAnimation'

export interface AnimationLibrary {
  start(animation: ImageAnimation): void;
  finish(animation: ImageAnimation): void;
  pause(animation: ImageAnimation): void;
}
