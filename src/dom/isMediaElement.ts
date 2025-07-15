import { env } from '../env';

export function isMediaElement(input: any) {

  const { Image, Canvas, Video } = env.getEnv()

  return input instanceof Image
    || input instanceof Canvas
    || input instanceof Video
}

export function isImageData(input: any): input is ImageData {
  const { ImageData } = env.getEnv()

  return input instanceof ImageData
}