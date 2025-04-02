import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Payment() {
  const { checkoutUrl } = useSelector((state: RootState) => state.payment);

  return (
    <>
     
    </>
  )
}