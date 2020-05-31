import fetch, { Headers } from "node-fetch";

import {
  PLAYER_API,
  SAVED_TRACKS_API,
  USER_PROFILE_API,
  USER_TOP_API,
  PLAYER_PLAY_API,
  CHECK_FOLLOWING_API,
  GET_TRACKS_API,
} from "./spotify.constants";
import {
  CurrentPlaybackResponse,
  LikesResponse,
  SpotifyTimeRange,
  SpotifyTopType,
} from "./spotify.types";

export const SpotifyService = new (class {
  constructor() {}

  getUserProfile(token: string): Promise<any> {
    return this.request(token, USER_PROFILE_API, "GET");
  }

  getCurrentlyPlaying(token: string): Promise<CurrentPlaybackResponse> {
    // Make a call using the token
    return this.request(token, PLAYER_API, "GET");
  }

  /**
   * Transfer playback to a new device and determine if it should start playing.
   * @param deviceIds array of device ids to transfer playback to, only a single device id is currently supported
   * @param play true: ensure playback happens on new device. false or not provided: keep the current playback state.
   */
  transferPlayback(
    token: string,
    deviceIds: string[],
    play: boolean = false
  ): Promise<any> {
    return this.request(token, PLAYER_API, "PUT", {
      device_ids: deviceIds,
      play,
    });
  }

  getLikes(
    token: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<LikesResponse> {
    return this.request(
      token,
      `${SAVED_TRACKS_API}?limit=${limit}&offset=${offset}`,
      "GET"
    );
  }

  getTop(
    token: string,
    type: SpotifyTopType,
    timeRange: SpotifyTimeRange = SpotifyTimeRange.ShortTerm,
    limit: number = 10,
    offset: number = 0
  ): Promise<any> {
    return this.request(
      token,
      `${USER_TOP_API}/${type}?limit=${limit}&offset=${offset}&time_range=${timeRange}`,
      "GET"
    );
  }

  playSongs(token: string, uris: string[]): Promise<any> {
    return this.request(token, `${PLAYER_PLAY_API}`, "PUT", { uris });
  }

  checkFollowers(
    token: string,
    ids: string[],
    type: string = "user"
  ): Promise<any> {
    const idsParam = ids.length
      ? `&ids=${encodeURIComponent(ids.join(","))}`
      : "";

    if (!idsParam) {
      // We can't check if the ids list is empty, return []
      return new Promise((resolve) => resolve([]));
    }

    return this.request(
      token,
      `${CHECK_FOLLOWING_API}?type=${type}${idsParam}`,
      "GET"
    );
  }

  getTracks(token: string, ids: string[]): Promise<any> {
    const idsParam = ids.length
      ? `&ids=${encodeURIComponent(ids.join(","))}`
      : "";

    if (!idsParam) {
      // We can't check if the ids list is empty, return []
      return new Promise((resolve) => resolve([]));
    }
    return this.request(token, `${GET_TRACKS_API}?${idsParam}`, "GET");
  }

  request(
    token: string,
    url: string,
    method: string,
    body?: any
  ): Promise<any> {
    return fetch(url, {
      method,
      headers: new Headers({
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify(body),
    })
      .then(this.parseJson)
      .then(this.errorHandler.bind(this));
  }

  parseJson(response: any) {
    return response.text().then(function (text: any) {
      return text ? JSON.parse(text) : {};
    });
  }

  errorHandler(response: any) {
    const { error } = response;
    if (error) {
      // Do something with error
    }
    return response;
  }
})();
