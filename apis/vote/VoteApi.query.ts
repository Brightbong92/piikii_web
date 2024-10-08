import { Parameter } from "@/types/utility/parameter";
import voteApi from "./VoteApi";
import { isNotNull } from "@/types/utility/is-not-null";
import { UseQueryParams } from "@/types/tanstack-query/use-query-params";
import { useQuery } from "@tanstack/react-query";

export const VOTE_API_QUERY_KEY = {
  GET_VOTES: (params: Parameter<typeof voteApi.getVotes>) =>
    ["votes", params.roomUid].filter(isNotNull),
  GET_VOTE_STATUS: (params: Parameter<typeof voteApi.getVoteStatus>) =>
    ["votes", "status", params.roomUid].filter(isNotNull),
  GET_USER_VOTE_RESULT: (params: Parameter<typeof voteApi.getUserVoteResult>) =>
    ["votes", "user", params.roomUid, params.userUid].filter(isNotNull),
};

export const useGetVotesQuery = (
  params: UseQueryParams<typeof voteApi.getVotes>
) => {
  const queryKey = VOTE_API_QUERY_KEY.GET_VOTES(params.variables);

  return useQuery({
    queryKey,
    queryFn: () => voteApi.getVotes(params?.variables),
    ...params?.options,
  });
};

export const useGetVoteStatusQuery = (
  params: UseQueryParams<typeof voteApi.getVoteStatus>
) => {
  const queryKey = VOTE_API_QUERY_KEY.GET_VOTE_STATUS(params.variables);

  return useQuery({
    queryKey,
    queryFn: () => voteApi.getVoteStatus(params?.variables),
    ...params?.options,
  });
};

export const useGetUserVoteResultQuery = (
  params: UseQueryParams<typeof voteApi.getUserVoteResult>
) => {
  const queryKey = VOTE_API_QUERY_KEY.GET_USER_VOTE_RESULT(params.variables);

  return useQuery({
    queryKey,
    queryFn: () => voteApi.getUserVoteResult(params?.variables),
    ...params?.options,
  });
};
