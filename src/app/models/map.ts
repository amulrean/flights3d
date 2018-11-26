export interface TileSet {
  name: string;
  url: string;
}

export interface ICartesian3 {
  x: number;
  y: number;
  z: number;
}

export interface ICameraState {
  position: ICartesian3;
  heading: number;
  pitch: number;
  roll: number;
}

export interface IRectangle {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface IMoveEndPayload {
  camera: ICameraState;
  viewRectangle: IRectangle;
}
