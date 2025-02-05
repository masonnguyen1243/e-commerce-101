import { memo, useState, useCallback } from "react";
import { productInfoTabs } from "../utils/contants";
import { VoteBar, Button, VoteOptions } from "../components";
import { renderStarFromNumber } from "../utils/helpers";
import { apiRatings } from "../apis";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/app/appSlice";
import Swal from "sweetalert2";
import path from "../utils/path";
import { useNavigate } from "react-router-dom";

const ProductInformation = ({
  totalRatings,
  ratings,
  nameProduct,
  pid,
  rerender,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const { isLoggedIn } = useSelector((state) => state.user);

  const handleSubmitVoteOptions = async ({ comment, score }) => {
    if (!comment || !pid || !score) {
      alert("Please vote when click submit");
      return;
    }
    const response = await apiRatings({
      star: score,
      comment,
      pid,
    });

    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    rerender();
  };

  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        title: "Oops",
        text: "Login to vote",
        cancelButtonText: "Cancel",
        confirmButtonText: "Go Login",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/${path.LOGIN}`);
        }
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOptions
              nameProduct={nameProduct}
              handleSubmitVoteOptions={handleSubmitVoteOptions}
            />
          ),
        }),
      );
    }
  };

  return (
    <div>
      <div className="relative bottom-[-2px] flex items-center gap-2">
        {productInfoTabs?.map((el) => (
          <span
            key={el.id}
            onClick={() => setActiveTab(el.id)}
            className={`cursor-pointer px-4 py-2 uppercase ${activeTab === el.id ? "border border-b-0 bg-white" : "bg-gray-200"}`}
          >
            {el.name}
          </span>
        ))}
        <div
          onClick={() => setActiveTab(5)}
          className={`cursor-pointer px-4 py-2 uppercase ${activeTab === 5 ? "border border-b-0 bg-white" : "bg-gray-200"}`}
        >
          CUSTOMER REVIEW
        </div>
      </div>

      <div className="w-full border p-4">
        {productInfoTabs?.some((el) => el.id === activeTab) &&
          productInfoTabs?.find((el) => el.id === activeTab)?.content}

        {activeTab === 5 && (
          <div className="flex flex-col p-4">
            <div className="flex">
              <div className="flex flex-4 flex-col items-center justify-center border border-red-500">
                <span className="text-3xl font-semibold">{`${totalRatings}/5`}</span>
                <span className="flex items-center gap-1">
                  {renderStarFromNumber(totalRatings)?.map((el, index) => (
                    <span key={index}>{el}</span>
                  ))}
                </span>
                <span className="text-sm">{`${ratings?.length} reviews`}</span>
              </div>
              <div className="flex flex-6 flex-col gap-2 border border-blue-500 p-4">
                {Array.from(Array(5).keys())
                  .reverse()
                  .map((el, index) => (
                    <VoteBar
                      key={index}
                      number={el + 1}
                      ratingTotal={ratings?.length}
                      ratingCount={
                        ratings?.filter((item) => item.star === el + 1)?.length
                      }
                    />
                  ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-4 text-sm">
              <span>Do you review this product?</span>
              <Button handleOnClick={handleVoteNow}>Rate now</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ProductInformation);
