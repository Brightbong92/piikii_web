import { AxiosInstance } from "axios";
import instance from "../instance";
import { SuccessSaveRoomResponse } from "./types/model";
import { RoomSaveRequestForm } from "./types/dto";

export class RoomApi {
  axios: AxiosInstance = instance;
  constructor(axios?: AxiosInstance) {
    if (axios) this.axios = axios;
  }

  createRoom = async (
    req: RoomSaveRequestForm
  ): Promise<SuccessSaveRoomResponse> => {
    const { data } = await this.axios({
      method: "POST",
      url: `/rooms`,
      data: req,
    });
    return data;
  };
}

const roomApi = new RoomApi();

export default roomApi;
