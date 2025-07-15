import { FaceDetection } from '../classes/FaceDetection';
import { Rect } from '../classes/Rect';
import { env } from '../env';
import { createCanvas } from './createCanvas';
import { getContext2dOrThrow } from './getContext2dOrThrow';
import { imageTensorToCanvas } from './imageTensorToCanvas';
import { toNetInput } from './toNetInput';
import { TNetInput } from './types';

/**
 * Extracts the image regions containing the detected faces.
 *
 * @param input The image that face detection has been performed on.
 * @param detections The face detection results or face bounding boxes for that image.
 * @returns The Canvases of the corresponding image region for each detected face.
 */
export async function extractFaces(
  input: TNetInput,
  detections: Array<FaceDetection | Rect>
): Promise<HTMLCanvasElement[]> {

  const { Canvas } = env.getEnv()

  let canvas = input as HTMLCanvasElement
  const boxes = detections.map(
    det => det instanceof FaceDetection
      ? det.forSize(canvas.width, canvas.height).box.floor()
      : det
  )
    .map(box => box.clipAtImageBorders(canvas.width, canvas.height))

  if (!(input instanceof Canvas)) {
    const netInput = await toNetInput(input)

    if (netInput.batchSize > 1) {
      throw new Error('extractFaces - batchSize > 1 not supported')
    }

    const tensorOrCanvasOrImageData = netInput.getInput(0)
    if (tensorOrCanvasOrImageData instanceof ImageData) {
      const imageData = tensorOrCanvasOrImageData
      return boxes.map(({ x, y, width, height }) => {
        const faceImg = createCanvas({ width, height })
        getContext2dOrThrow(faceImg)
          .putImageData(imageData, 0, 0, x, y, width, height)
        return faceImg
      })
    } else if (tensorOrCanvasOrImageData instanceof Canvas) {
      canvas = tensorOrCanvasOrImageData
    } else {
      canvas = await imageTensorToCanvas(tensorOrCanvasOrImageData)
    }
  }

  const ctx = getContext2dOrThrow(canvas)
  return boxes.map(({ x, y, width, height }) => {
    const faceImg = createCanvas({ width, height })
    getContext2dOrThrow(faceImg)
      .putImageData(ctx.getImageData(x, y, width, height), 0, 0)
    return faceImg
  })
}