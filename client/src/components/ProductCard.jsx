import { renderStarFromNumber, formatMoney } from "../utils/helpers";

const ProductCard = ({ image, title, totalRatings, price }) => {
  return (
    <div className="mb-[20px] w-1/3 flex-auto px-[10px]">
      <div className="flex w-full border">
        <img src={image} alt="" className="w-[120px] object-contain p-4" />
        <div className="mt-[15px] flex w-full flex-col items-start gap-1 text-xs">
          <span className="line-clamp-1 text-sm capitalize">
            {title?.toLowerCase()}
          </span>
          <span className="flex h-4">
            {renderStarFromNumber(totalRatings, 14)?.map((el, index) => (
              <span key={index}>{el}</span>
            ))}
          </span>
          <span>{`${formatMoney(price)} VND`}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
