import { useParams } from "react-router-dom";
import { apiGetDetailProduct } from "../../apis";
import { useState, useEffect, useCallback } from "react";
import { Breadcrumbs, Button, SelectQuantity } from "../../components";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import {
  formatPrice,
  formatMoney,
  renderStarFromNumber,
} from "../../utils/helpers";

var settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const DetailProducts = () => {
  const { pid, title, category } = useParams();
  const [products, setProducts] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProductData = async () => {
    const response = await apiGetDetailProduct(pid);
    if (response.success) {
      setProducts(response.productData);
    }
  };

  useEffect(() => {
    if (pid) {
      fetchProductData();
    }
  }, [pid]);

  const handleQuantity = useCallback(
    (number) => {
      if (!Number(number) || Number(number) < 1) {
        return;
      } else {
        setQuantity(number);
      }
    },
    [quantity],
  );

  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === "minus" && quantity === 1) return;
      if (flag === "minus") setQuantity((prev) => +prev - 1);
      if (flag === "plus") setQuantity((prev) => +prev + 1);
    },
    [quantity],
  );

  return (
    <div className="w-full">
      <div className="flex h-[81px] items-center justify-center bg-gray-100">
        <div className="w-main">
          <h3 className="font-semibold">{title}</h3>
          <Breadcrumbs title={title} category={category} />
        </div>
      </div>

      <div className="m-auto mt-4 flex w-main">
        <div className="flex w-2/5 flex-col gap-4">
          <div className="h-[458px] w-[458px] border">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Wristwatch by Ted Baker London",
                  isFluidWidth: true,
                  src: products?.thumb,
                },
                largeImage: {
                  src: products?.thumb,
                  width: 1800,
                  height: 1500,
                },
              }}
            />
          </div>
          <div className="w-[458px]">
            <Slider
              className="images-slider flex justify-between gap-2"
              {...settings}
            >
              {products?.images?.map((el, index) => (
                <div key={index} className="flex-1">
                  <img
                    src={el}
                    alt="sub-product"
                    className="h-[143px] border object-contain"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="flex w-2/5 flex-col gap-4 pr-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[30px] font-semibold">{`${formatMoney(formatPrice(products?.price))} VND`}</h2>
            <span className="text-sm text-main">{`Store: ${products?.quantity}`}</span>
          </div>
          <div className="flex items-center gap-1">
            {renderStarFromNumber(products?.totalRatings)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
            <span className="text-sm italic text-main">{`(Sold ${products?.sold})`}</span>
          </div>
          <ul className="list-disc pl-5 text-sm text-gray-500">
            {products?.description?.map((el, index) => (
              <li className="leading-6" key={index}>
                {el}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-8">
            <SelectQuantity
              handleQuantity={handleQuantity}
              quantity={quantity}
              handleChangeQuantity={handleChangeQuantity}
            />
            <Button fullWidth>Add to cart</Button>
          </div>
        </div>
        <div className="w-1/5 border border-green-300">info</div>
      </div>

      <div className="h-[500px] w-full"></div>
    </div>
  );
};

export default DetailProducts;
