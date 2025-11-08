import { withProtected } from "@/utils/auth/use-protected";
import getObjectValues from "@/utils/firebase/get-object-values";
import useCreateValue from "@/utils/firebase/use-create-value";
import useRealtimeValue from "@/utils/firebase/use-realtime-value";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Chat = {
  message: string;
};

const TestChat = () => {
  const { data, isLoading, error } = useRealtimeValue("/test/chat");
  const { pushValue } = useCreateValue();
  const { register, handleSubmit, reset } = useForm<Chat>();

  const onSend = async (data: Chat) => {
    try {
      await pushValue("/test/chat", data);
    } catch (err) {
      console.error(err);
      alert("ERROR WAK");
    } finally {
      reset();
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error while fetching</div>;
  }

  return (
    <div className="flex flex-col max-w-sm p-4">
      <form onSubmit={handleSubmit(onSend)} className="w-full">
        <div>
          {data &&
            getObjectValues(data as object).map((chat, idx) => (
              <div key={idx}>{chat.message}</div>
            ))}
        </div>
        <div className="w-full flex">
          <input
            type="text"
            className="border"
            {...register("message", { required: true })}
          />
          <button type="submit" className="border px-2">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

const TestChatPage = withProtected(TestChat);
export default TestChatPage;
