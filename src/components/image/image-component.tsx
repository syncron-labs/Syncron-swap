import Image, { ImageProps } from "next/image";

interface ImageComponentProps extends ImageProps {
  objectFit?: string;
  objectPosition?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt,
  width = 100,
  height = 100,
  objectFit,
  objectPosition,
  className,
  style,
  ...rest
}) => {
  return (
    <Image
      src={src ? src : "/placeholder.png"}
      alt={alt}
      height={height}
      width={width}
      quality={100}
      className={className}
      style={style}
      blurDataURL={"/placeholder.png"}
      placeholder="blur"
      objectFit={objectFit || "cover"}
      objectPosition={objectPosition || "center"}
      {...rest}
    />
  );
};

export default ImageComponent;
