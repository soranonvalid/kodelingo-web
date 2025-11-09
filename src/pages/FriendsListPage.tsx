import { withProtected } from "@/utils/auth/use-protected";
import getObjectValues from "@/utils/firebase/get-object-values";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Check,
  MessageCircleMore,
  User,
  UserCheck,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FirebaseUser } from "@/types/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/user";
import { type Request } from "@/types/firebase";
import useFriends from "@/utils/friends/use-friends";
import { useNavigate } from "react-router-dom";

const FriendsList = () => {
  const { uid } = useUser();
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useRealtimeValue<Record<string, FirebaseUser>>("/users");
  const { data: requests, isLoading: requestsLoading } = useRealtimeValue(
    `/friendRequests/${uid}`
  );
  const { data: friends, isLoading: friendsLoading } = useRealtimeValue<
    Record<string, boolean>
  >(`/friends/${uid}`);
  const { data: allRequests, isLoading: allRequestsLoading } =
    useRealtimeValue<Record<string, Record<string, Request>>>(
      "/friendRequests"
    );
  const navigate = useNavigate();
  const {
    handleSendRequest,
    declineFriendRequest,
    acceptFriendRequest,
    removeFriend,
  } = useFriends();
  const [filteredUsers, setFilteredUsers] = useState<FirebaseUser[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      return setFilteredUsers([]);
    }

    if (value) {
      return setFilteredUsers(
        getObjectValues(users as object).filter(
          (user) =>
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.displayName.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    console.log(friends);
  }, [
    users,
    usersLoading,
    usersError,
    requests,
    requestsLoading,
    friends,
    friendsLoading,
    allRequests,
    allRequestsLoading,
  ]);

  if (usersLoading || requestsLoading) {
    return <div>Loading...</div>;
  }

  if (usersError) {
    return <div>Error while fetching</div>;
  }

  return (
    <div className="w-full max-h-svh min-h-svh flex justify-center overflow-y-scroll">
      <div className="max-w-3xl w-full py-3 px-4 md:px-0 h-full flex flex-col">
        <div className="flex w-full items-center justify-between">
          <h1 className="font-bold">Friends List</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="grid place-items-center">
                <Tooltip>
                  <TooltipTrigger asChild className="hover:cursor-pointer px-3">
                    <button className="relative">
                      <Bell className="w-4.5" />
                      {requests &&
                      getObjectValues(requests as object).length > 0 ? (
                        <div className="bg-orange-600 text-white text-sm rounded-full w-5 h-5 grid place-items-center absolute bottom-0 right-0">
                          <span>
                            {getObjectValues(requests as object).length}
                          </span>
                        </div>
                      ) : (
                        <></>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Requests</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="border-black/50 border"
            >
              <DropdownMenuGroup className="min-w-[300px] p-1">
                {requests ? (
                  getObjectValues(requests as object).map((req: Request) => (
                    <div
                      key={req.from}
                      className="flex gap-3 items-center bg-white hover:bg-black/5 p-2 rounded-sm"
                    >
                      <Avatar className="border-black border">
                        <AvatarImage
                          src={
                            (users as { [key: string]: FirebaseUser })[req.from]
                              .photoURL
                          }
                        />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-sm">
                        <span>
                          {
                            (users as { [key: string]: FirebaseUser })[req.from]
                              .displayName
                          }
                        </span>
                      </div>
                      <div className="ml-auto pr-2 flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="hover:cursor-pointer"
                              onClick={() => acceptFriendRequest(req.from)}
                            >
                              <Check className="w-4.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="text-[12px]">Accept</span>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="hover:cursor-pointer"
                              onClick={() => declineFriendRequest(req.from)}
                            >
                              <X className="w-4.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <span className="text-[12px]">Decline</span>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm px-2">You don't have any requests</p>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full relative flex mt-2">
          <input
            type="text"
            className="w-full text-sm px-4 py-3 bg-black/5 focus:outline-2 focus:outline-black/50 focus:rounded-sm font-jakarta focus:bg-[#DFDFDF]/25"
            placeholder="Search or add user.."
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              transition: "all ease-in-out 200ms",
            }}
          />
          {isFocused && filteredUsers.length > 0 ? (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="w-full max-w-[700px] bg-white absolute border-black/50 border rounded-sm top-14 max-h-svh flex flex-col p-2 gap-2 z-100"
            >
              {filteredUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex gap-3 items-center bg-white hover:bg-black/5 p-2 rounded-sm"
                  style={{
                    transition: "all ease-in-out 90ms",
                  }}
                >
                  <Avatar className="border-black border">
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-sm">
                    <span>{user?.displayName}</span>
                  </div>
                  <div className="ml-auto pr-2">
                    {user.uid === uid || friends?.[user.uid] ? (
                      <></>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger>
                          {allRequests?.[user.uid]?.[uid as string] ? (
                            <UserCheck className="w-4.5 ml-auto hover:cursor-pointer" />
                          ) : (
                            <UserPlus
                              className="w-4.5 ml-auto hover:cursor-pointer"
                              onClick={() => handleSendRequest(user.uid)}
                            />
                          )}
                        </TooltipTrigger>
                        <TooltipContent className="z-101">
                          {allRequests?.[user.uid]?.[uid as string] ? (
                            <p>Request has sent</p>
                          ) : (
                            <p>Add friend</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="w-full flex flex-col mt-4 h-full">
          <span className="text-sm">
            Friends {friends ? `(${getObjectValues(friends).length})` : "(0)"}
          </span>
          <div className="w-full text-sm grid place-items-center py-5 h-full text-black/60">
            <div className="flex flex-col justify-center items-center w-full">
              {!friends || Object.keys(friends).length === 0 ? (
                <>
                  <span className="text-2xl">😭</span>
                  <span>You don't have friends</span>
                </>
              ) : (
                Object.keys(friends || {}).map((fid) => {
                  const friend = users?.[fid];
                  return (
                    <div
                      className="flex w-full gap-4 items-center hover:bg-black/5 p-3 rounded-lg"
                      key={friend?.uid}
                    >
                      <Avatar className="w-12 h-12 border-black border">
                        <AvatarImage src={friend?.photoURL} />
                        <AvatarFallback>
                          <User />
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-full flex flex-col">
                        <span className="text-black">
                          {friend?.displayName}
                        </span>
                      </div>
                      <div className="ml-auto pr-2 flex gap-7">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="hover:cursor-pointer"
                              onClick={() =>
                                removeFriend(friend?.uid || "error")
                              }
                            >
                              <UserMinus className="w-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Remove friend</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="hover:cursor-pointer"
                              onClick={() => navigate("/chat/" + friend?.uid)}
                            >
                              <MessageCircleMore className="w-5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Chat</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FriendsListPage = withProtected(FriendsList);
export default FriendsListPage;
