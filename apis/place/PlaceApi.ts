import { AxiosInstance } from "axios";
import instance from "../instance";
import { ResponseForm } from "../common/model";
import {
  AddPlaceRequestDto,
  CreatePlacePayloadDto,
  ModifyPlaceRequestDto,
  PlaceResponseDto,
  ScheduleTypeGroupResponse,
  SuccessPlaceTypeGroupResponse,
} from "./types/dto";

class PlaceApi {
  axios: AxiosInstance = instance;
  constructor(axios?: AxiosInstance) {
    if (axios) this.axios = axios;
  }

  getPlaces = async ({
    roomUid,
  }: {
    roomUid: string;
  }): Promise<SuccessPlaceTypeGroupResponse> => {
    const { data } = await this.axios({
      method: "GET",
      url: `/rooms/${roomUid}/places`,
    });
    return data;
  };

  createPlace = async ({
    roomUid,
    payload,
  }: {
    roomUid: string;
    payload: CreatePlacePayloadDto;
  }): Promise<ResponseForm<PlaceResponseDto>> => {
    const formData = new FormData();

    formData.append("addPlaceRequest", JSON.stringify(payload.addPlaceRequest));

    if (
      !payload.addPlaceRequest.autoCompletedPlaceImageUrls ||
      payload.addPlaceRequest.autoCompletedPlaceImageUrls.length === 0
    ) {
      payload.placeImages?.forEach((image) => {
        formData.append("placeImages", image);
      });
    }

    const { data } = await this.axios({
      method: "POST",
      url: `/rooms/${roomUid}/places`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  };

  deletePlace = async ({
    roomUid,
    placeId,
  }: {
    roomUid: string;
    placeId: number;
  }): Promise<ResponseForm> => {
    const { data } = await this.axios({
      method: "DELETE",
      url: `/rooms/${roomUid}/places/${placeId}`,
    });
    return data;
  };

  updatePlace = async ({
    roomUid,
    placeId,
    payload,
  }: {
    roomUid: string;
    placeId: number;
    payload: {
      modifyPlaceRequest: ModifyPlaceRequestDto;
      newPlaceImages: File[];
    };
  }): Promise<ResponseForm<PlaceResponseDto>> => {
    const formData = new FormData();

    formData.append(
      "modifyPlaceRequest",
      JSON.stringify(payload.newPlaceImages)
    );
    if (!payload.newPlaceImages || payload.newPlaceImages.length === 0) {
      payload.newPlaceImages?.forEach((image) => {
        formData.append("newPlaceImages", image);
      });
    }

    const { data } = await this.axios({
      method: "PATCH",
      url: `/rooms/${roomUid}/places/${placeId}`,
      data: payload,
    });
    return data;
  };
}

const placeApi = new PlaceApi();

export default placeApi;
