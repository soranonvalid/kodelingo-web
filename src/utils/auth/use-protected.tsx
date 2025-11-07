import { useUser } from "@/context/user";
import { type ComponentType } from "react";

export function withProtected<P extends object>(
  Page: ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const router = location;
    const user = useUser();
    const { uid } = user;
    if (!uid) {
      router.replace("/login");
      return <></>;
    }
    return <Page {...props} />;
  };
}

export function withUnprotected<P extends object>(
  Page: ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const router = location;
    const user = useUser();
    const { uid } = user;
    if (uid) {
      router.replace("/");
      return <></>;
    }
    return <Page {...props} />;
  };
}
