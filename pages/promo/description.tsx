import { useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import axiosClient from "../../utils/axiosClient";
import BASE_URL from "../../utils/BaseURL";
import Button from "../../components/Button";
import SubscribedPage from "../../components/SubscribedPage";
import { useRouter } from "next/router";

const ChangeDescription = () => {
  const { user, loading } = useContext(AppContext);
  const [description, setDescription] = useState<string>();
  const router = useRouter();

  
  useEffect(() => {
    if (user.value?.promo?.description) {
      setDescription(user.value.promo.description)
    }
  }, [user.value])

  const changeDescription = async () => {
    if (!description || description.trim() == "") {
      toast.error("Enter your app description");
      return;
    }
    else if (description.length > 120) {
      toast.error("Description must have lesser than 120 characters")
    }
    try {
      loading.set(true);
      const { data } = await axiosClient.post(
        BASE_URL + "/promo/update_description",
        { description }
      );
      if (data.success) {
        loading.set(false);
        toast.success(data.message);
        user.set(data.user);
        router.push("/promo/create");
      }
    } catch {
      loading.set(false);
      toast.error("An error occurred");
    }
  };

  return (
    <SubscribedPage user={user}>
      <div className="min-h-[90vh] flex flex-col items-center justify-center text-center px-[8px]">
        <h4 className="capitalize text-4xl font-bold mb-2 text-center">
          Enter your app description
        </h4>
        <div>
          <input
            onChange={(e) => setDescription(e.target.value)}
            className="shadow-md mb-4 mx-4 mt-5 shadow-[#00000040] appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Description of your app (Min 120 char)"
            value={description}
          />
        </div>

        <Button
          color="dark"
          className="p-4 mt-3 rounded-full text-3xl"
          onClick={changeDescription}
        >
          <FaArrowRight />
        </Button>
      </div>
    </SubscribedPage>
  );
};

export default ChangeDescription;
