import { Dimensions, IDimensions } from '../classes/Dimensions';
import { env } from '../env';

export function getMediaDimensions(input: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | IDimensions): Dimensions {

  const { Image, ImageData, Video } = env.getEnv()

  if (input instanceof Image) {
    return new Dimensions(input.naturalWidth, input.naturalHeight)
  }
  if (input instanceof ImageData) {
    return new Dimensions(input.width, input.height)
  }
  if (input instanceof Video) {
    return new Dimensions(input.videoWidth, input.videoHeight)
  }
  return new Dimensions(input.width, input.height)
}
